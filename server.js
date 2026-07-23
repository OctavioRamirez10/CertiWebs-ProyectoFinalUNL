const express = require('express');
const bodyParser = require('body-parser');
const db = require('./server/database');
const nodemailer = require('nodemailer');
const { enviarCorreosContacto, enviarCorreosBoletin } = require('./server/mailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
require('dotenv').config();
const path = require('path');

const app = express();

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_change_me';
const ADMIN_KEY = process.env.ADMIN_KEY || 'admin1234';
const EventEmitter = require('events');
const sseEmitter = new EventEmitter();
sseEmitter.setMaxListeners(0);

function broadcast(eventType, payload) {
    sseEmitter.emit('update', { eventType, payload });
}



function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. Formato de token inválido.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido o expirado.' });
    }
}

function verificarTokenOpcional(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        if (token) {
            try {
                const decoded = jwt.verify(token, JWT_SECRET);
                req.usuario = decoded;
            } catch (error) {
                // Si el token es inválido o expirado, ignorar y seguir como invitado
            }
        }
    }
    next();
}

// Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

const manejarErroresValidacion = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Errores de validación', detalles: errors.array() });
    }
    next();
};

app.post('/api/registro', [
    body('username').trim().isLength({ min: 3, max: 50 }).withMessage('El usuario debe tener entre 3 y 50 caracteres').matches(/^[\p{L}0-9_ ]+$/u).withMessage('El usuario solo puede contener letras, números, espacios y caracteres en español').escape(),
    body('email').trim().isEmail().withMessage('Debe ser un email válido').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    manejarErroresValidacion
], async (req, res) => {
    const { username, password, email } = req.body;
    try {
        const hashed = await bcrypt.hash(password, 10);
        db.run('INSERT INTO usuarios (username, password, email, rol) VALUES (?, ?, ?, ?)',
            [username, hashed, email, 'usuario'],
            function (err) {
                if (err) {
                    if (err.code === 'SQLITE_CONSTRAINT') {
                        res.status(409).json({ error: 'El usuario o email ya existe. Por favor inicia sesión.' });
                    } else {
                        res.status(400).json({ error: 'Error al registrar usuario' });
                    }
                    return;
                }
                const token = jwt.sign({ id: this.lastID, username, email, rol: 'usuario' }, JWT_SECRET, { expiresIn: '24h' });
                res.json({ id: this.lastID, username, email, rol: 'usuario', token });
                try { broadcast('usuario', { id: this.lastID, username, email }); } catch (e) { /* noop */ }
            });
    } catch (e) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.post('/api/login', [
    body('email').trim().notEmpty().withMessage('El email o usuario es requerido'),
    body('password').notEmpty().withMessage('La contraseña es requerida'),
    manejarErroresValidacion
], (req, res) => {
    const { email: loginInput, password } = req.body;
    // Aceptar login por email O por username
    const esEmail = loginInput.includes('@');
    const query = esEmail
        ? 'SELECT id, username, email, password, rol FROM usuarios WHERE email = ?'
        : 'SELECT id, username, email, password, rol FROM usuarios WHERE username = ?';
    const valorBusqueda = esEmail ? loginInput.toLowerCase().trim() : loginInput.trim();

    db.get(query, [valorBusqueda], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la base de datos' });
        }
        if (!row) {
            return res.status(401).json({ error: 'Credenciales inválidas. Verifica tu usuario/email y contraseña.' });
        }
        bcrypt.compare(password, row.password, (bcryptErr, same) => {
            if (bcryptErr) {
                return res.status(500).json({ error: 'Error en la autenticación' });
            }
            if (same) {
                const rol = row.rol || 'usuario';
                const token = jwt.sign(
                    { id: row.id, username: row.username, email: row.email, rol },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                );
                res.json({ id: row.id, username: row.username, email: row.email, rol, token });
            } else {
                res.status(401).json({ error: 'Credenciales inválidas. Verifica tu usuario/email y contraseña.' });
            }
        });
    });
});

// Endpoint para verificar sesión activa
app.get('/api/me', verificarToken, (req, res) => {
    db.get('SELECT id, username, email, rol, fecha_registro FROM usuarios WHERE id = ?',
        [req.usuario.id],
        (err, row) => {
            if (err || !row) return res.status(404).json({ error: 'Usuario no encontrado' });
            res.json(row);
        }
    );
});

app.post('/api/examenes', verificarToken, [
    body('usuario_id').isInt().withMessage('ID de usuario inválido'),
    body('examen_id').trim().notEmpty().withMessage('ID de examen requerido').escape(),
    body('puntuacion').isInt({ min: 0, max: 100 }).withMessage('Puntuación inválida'),
    manejarErroresValidacion
], (req, res) => {
    const { usuario_id, examen_id, puntuacion } = req.body;
    const userIdNum = parseInt(usuario_id, 10);

    // Check if the token's user is the same as the body's user_id
    if (req.usuario.id !== userIdNum) {
        return res.status(403).json({ error: 'No tienes permiso para guardar este examen' });
    }

    db.run('INSERT INTO examenes_completados (usuario_id, examen_id, puntuacion) VALUES (?, ?, ?)',
        [userIdNum, examen_id, puntuacion],
        function (err) {
            if (err) {
                return res.status(400).json({ error: 'Error al guardar resultado' });
            }
            res.json({ id: this.lastID, mensaje: 'Resultado guardado exitosamente' });
            try { broadcast('examen', { id: this.lastID, usuario_id: userIdNum, examen_id, puntuacion }); } catch (e) { }
        });
});

app.post('/api/contact', [
    body('name').trim().notEmpty().withMessage('Nombre es requerido').escape(),
    body('email').trim().isEmail().withMessage('Email inválido').normalizeEmail(),
    body('type').optional().trim().escape(),
    body('subject').optional().trim().escape(),
    body('message').trim().notEmpty().withMessage('Mensaje es requerido').escape(),
    manejarErroresValidacion
], (req, res) => {
    const { name, email, type, subject, message } = req.body;
    const cleanSubject = subject || 'Sin asunto';
    const tipoConsulta = type || 'Consulta General';
    const fechaActual = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });

    db.run('INSERT INTO contactos (nombre, email, asunto, mensaje, fecha_envio) VALUES (?, ?, ?, ?, datetime("now"))',
        [name, email, `${tipoConsulta}: ${cleanSubject}`, message],
        async function (err) {
            if (err) {
                console.error('Error al insertar en la tabla contactos:', err);
                return res.status(500).json({ error: 'Error al guardar el mensaje en la base de datos' });
            }

            const contactoId = this.lastID;
            const ticketId = `#CONT-${String(contactoId).padStart(4, '0')}`;

            // Emitir evento SSE en tiempo real
            try {
                broadcast('contacto', { id: contactoId, nombre: name, email, asunto: cleanSubject, tipo: tipoConsulta, fecha: fechaActual });
            } catch (e) { }

            // Enviar correo de confirmación en segundo plano
            enviarCorreosContacto({
                id: contactoId,
                nombre: name,
                email,
                tipoConsulta,
                asunto: cleanSubject,
                mensaje: message,
                fechaEnvio: fechaActual
            }).catch(err => console.error('❌ Error enviando email de contacto en background:', err.message));

            return res.json({
                id: contactoId,
                ticket: ticketId,
                mensaje: `¡Mensaje enviado exitosamente! Se ha registrado tu consulta.`
            });
        });
});

app.post('/api/newsletter', [
    body('email').trim().isEmail().withMessage('Debe ser un email válido').normalizeEmail(),
    manejarErroresValidacion
], (req, res) => {
    const { email } = req.body;
    const fechaActual = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });

    db.run('INSERT INTO boletin (email) VALUES (?)', [email], async function (err) {
        if (err) {
            if (err.code === 'SQLITE_CONSTRAINT') {
                // Si ya está suscrito, buscamos su ID para enviar la notificación igualmente
                db.get('SELECT id FROM boletin WHERE email = ?', [email], (getErr, row) => {
                    if (getErr || !row) {
                        return res.status(500).json({ error: 'Error al procesar la suscripción al boletín.' });
                    }
                    const suscripcionId = row.id;
                    const ticketId = `#BOL-${String(suscripcionId).padStart(4, '0')}`;

                    enviarCorreosBoletin({
                        id: suscripcionId,
                        email,
                        fechaSuscripcion: fechaActual
                    }).catch(errMail => console.error('❌ Error enviando email de boletín en background:', errMail.message));

                    return res.json({
                        id: suscripcionId,
                        ticket: ticketId,
                        mensaje: `¡Suscripción exitosa! Te hemos suscrito al boletín de noticias.`
                    });
                });
                return;
            }
            return res.status(500).json({ error: 'Error al procesar la suscripción al boletín.' });
        }

        const suscripcionId = this.lastID;
        const ticketId = `#BOL-${String(suscripcionId).padStart(4, '0')}`;

        // Broadcast SSE
        try { broadcast('boletin', { id: suscripcionId, email, fecha: fechaActual }); } catch (e) { }

        // Enviar correos automáticos en segundo plano
        enviarCorreosBoletin({
            id: suscripcionId,
            email,
            fechaSuscripcion: fechaActual
        }).catch(err => console.error('❌ Error enviando email de boletín en background:', err.message));

        return res.json({
            id: suscripcionId,
            ticket: ticketId,
            mensaje: `¡Suscripción exitosa! Te hemos suscrito al boletín de noticias.`
        });
    });
});

// Suscripción a newsletter (endpoint alternativo)
app.post('/api/subscribe', [
    body('email').trim().isEmail().withMessage('Email inválido').normalizeEmail()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Email inválido' });
    const { email } = req.body;
    const fechaActual = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });

    db.run('INSERT INTO suscripciones (email) VALUES (?)', [email], async function (err) {
        if (err) {
            if (err.code === 'SQLITE_CONSTRAINT') {
                // Si ya está suscrito, buscamos su ID para enviar la notificación igualmente
                db.get('SELECT id FROM suscripciones WHERE email = ?', [email], (getErr, row) => {
                    if (getErr || !row) {
                        return res.status(500).json({ error: 'Error al guardar la suscripción.' });
                    }
                    const suscripcionId = row.id;

                    enviarCorreosBoletin({
                        id: suscripcionId,
                        email,
                        fechaSuscripcion: fechaActual
                    }).catch(errMail => console.error('❌ Error enviando email de boletín en background:', errMail.message));

                    return res.json({
                        id: suscripcionId,
                        mensaje: `¡Suscripción exitosa! Te hemos suscrito al boletín.`
                    });
                });
                return;
            }
            return res.status(500).json({ error: 'Error al guardar la suscripción.' });
        }

        const suscripcionId = this.lastID;
        try { broadcast('suscripcion', { id: suscripcionId, email, fecha: fechaActual }); } catch (e) { }

        // Enviar correos automáticos en segundo plano
        enviarCorreosBoletin({
            id: suscripcionId,
            email,
            fechaSuscripcion: fechaActual
        }).catch(err => console.error('❌ Error enviando email de boletín en background:', err.message));

        return res.json({
            id: suscripcionId,
            mensaje: `¡Suscripción exitosa! Te hemos suscrito al boletín.`
        });
    });
});

// Obtener información de un certificado por código de verificación
app.get('/api/certificado/:codigo', (req, res) => {
    const codigo = req.params.codigo;
    db.get(`SELECT c.id, c.examen_id, c.fecha_emision, c.codigo_verificacion, u.id as usuario_id, u.username, u.email,
                   COALESCE((SELECT MAX(puntuacion) FROM examenes_completados WHERE usuario_id = c.usuario_id AND examen_id = c.examen_id), 80) as puntuacion
            FROM certificados c JOIN usuarios u ON c.usuario_id = u.id WHERE c.codigo_verificacion = ?`, [codigo], (err, row) => {
        if (err) return res.status(500).json({ error: 'Error en la base de datos' });
        if (!row) return res.status(404).json({ error: 'Certificado no encontrado' });
        res.json(row);
    });
});

app.get('/api/certificados/:usuario_id', verificarToken, (req, res) => {
    const usuario_id = parseInt(req.params.usuario_id);
    if (req.usuario.id !== usuario_id) {
        return res.status(403).json({ error: 'No autorizado' });
    }
    db.all('SELECT * FROM certificados WHERE usuario_id = ?',
        [usuario_id],
        (err, rows) => {
            if (err) {
                return res.status(400).json({ error: 'Error al obtener certificados' });
            }
            res.json(rows);
        });
});

app.get('/api/examenes/:usuario_id', verificarToken, (req, res) => {
    const usuario_id = parseInt(req.params.usuario_id);
    if (req.usuario.id !== usuario_id) {
        return res.status(403).json({ error: 'No autorizado' });
    }
    db.all('SELECT * FROM examenes_completados WHERE usuario_id = ? ORDER BY fecha DESC',
        [usuario_id],
        (err, rows) => {
            if (err) {
                return res.status(400).json({ error: 'Error al obtener historial' });
            }
            res.json(rows);
        });
});

app.post('/api/certificados', verificarToken, [
    body('usuario_id').isInt().withMessage('ID de usuario inválido'),
    body('examen_id').trim().notEmpty().withMessage('ID de examen requerido').escape(),
    manejarErroresValidacion
], (req, res) => {
    const usuario_id = parseInt(req.body.usuario_id, 10);
    const { examen_id } = req.body;

    // Comparar ambos como números para evitar el bug de tipo
    if (req.usuario.id !== usuario_id) {
        return res.status(403).json({ error: 'No autorizado' });
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const codigo = `CERT-${examen_id.toUpperCase()}-${Date.now()}-${randomSuffix}`;
    db.run('INSERT INTO certificados (usuario_id, examen_id, codigo_verificacion) VALUES (?, ?, ?)',
        [usuario_id, examen_id, codigo],
        function (err) {
            if (err) {
                if (err.code === 'SQLITE_CONSTRAINT') {
                    // Ya tiene certificado para este examen, obtenerlo
                    db.get('SELECT * FROM certificados WHERE usuario_id = ? AND examen_id = ?',
                        [usuario_id, examen_id],
                        (e, existente) => {
                            if (existente) {
                                return res.json({ id: existente.id, codigo_verificacion: existente.codigo_verificacion, mensaje: 'Certificado ya existía' });
                            }
                            return res.status(400).json({ error: 'Error al crear certificado' });
                        }
                    );
                    return;
                }
                return res.status(400).json({ error: 'Error al crear certificado' });
            }
            res.json({ id: this.lastID, codigo_verificacion: codigo, mensaje: 'Certificado creado exitosamente' });
            try { broadcast('certificado', { id: this.lastID, usuario_id, examen_id, codigo_verificacion: codigo }); } catch (e) { }
        });
});
// Rutas de administración (dev / auditoría)
function checkAdmin(req, res, next) {
    const provided = req.headers['x-admin-key'] || req.query.admin_key;
    if (!provided || provided !== ADMIN_KEY) {
        return res.status(403).json({ error: 'Admin key inválida o no proporcionada' });
    }
    next();
}

app.get('/api/admin/usuarios', checkAdmin, (req, res) => {
    db.all('SELECT id, username, email, fecha_registro FROM usuarios ORDER BY id DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Error en la base de datos' });
        res.json(rows);
    });
});

// SSE stream (protegido por admin key)
app.get('/api/admin/stream', checkAdmin, (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive'
    });

    const send = (obj) => {
        const payload = JSON.stringify(obj.payload || {});
        res.write(`event: ${obj.eventType}\n`);
        res.write(`data: ${payload}\n\n`);
    };

    const listener = (d) => send(d);
    sseEmitter.on('update', listener);

    // Keep connection open until client disconnects
    req.on('close', () => {
        sseEmitter.removeListener('update', listener);
    });
});

app.get('/api/admin/examenes', checkAdmin, (req, res) => {
    db.all('SELECT * FROM examenes_completados ORDER BY fecha DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Error en la base de datos' });
        res.json(rows);
    });
});

app.get('/api/admin/certificados', checkAdmin, (req, res) => {
    db.all('SELECT * FROM certificados ORDER BY fecha_emision DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Error en la base de datos' });
        res.json(rows);
    });
});

app.get('/api/admin/suscripciones', checkAdmin, (req, res) => {
    db.all('SELECT * FROM suscripciones ORDER BY fecha_subscripcion DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Error en la base de datos' });
        res.json(rows);
    });
});

app.get('/api/admin/boletin', checkAdmin, (req, res) => {
    db.all('SELECT * FROM boletin ORDER BY fecha_suscripcion DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Error en la base de datos' });
        res.json(rows);
    });
});

app.get('/api/admin/contactos', checkAdmin, (req, res) => {
    db.all('SELECT * FROM contactos ORDER BY fecha_envio DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Error en la base de datos' });
        res.json(rows);
    });
});

app.get('/api/admin/overview', checkAdmin, (req, res) => {
    const out = {};
    db.serialize(() => {
        db.get('SELECT COUNT(*) AS c FROM usuarios', [], (e, r) => { out.usuarios = r ? r.c : 0; });
        db.get('SELECT COUNT(*) AS c FROM examenes_completados', [], (e, r) => { out.examenes = r ? r.c : 0; });
        db.get('SELECT COUNT(*) AS c FROM certificados', [], (e, r) => { out.certificados = r ? r.c : 0; });
        db.get('SELECT COUNT(*) AS c FROM suscripciones', [], (e, r) => { out.suscripciones = r ? r.c : 0; });
        db.get('SELECT COUNT(*) AS c FROM boletin', [], (e, r) => { out.boletin = r ? r.c : 0; });
        db.get('SELECT COUNT(*) AS c FROM contactos', [], (e, r) => { out.contactos = r ? r.c : 0; res.json(out); });
    });
});

module.exports = app;

app.use((err, req, res, next) => {
    console.error('Error global:', err);
    if (process.env.NODE_ENV === 'production') {
        res.status(500).json({ error: 'Error interno del servidor' });
    } else {
        res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    }
});

app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Servidor CertiWebs iniciado correctamente en el puerto ' + PORT);
});