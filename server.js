const express = require('express');
const bodyParser = require('body-parser');
const db = require('./server/database');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
require('dotenv').config();
const path = require('path');

const app = express();

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_change_me';
const ADMIN_KEY = process.env.ADMIN_KEY || 'admin1234';



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

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    } : undefined
});

const manejarErroresValidacion = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Errores de validación', detalles: errors.array() });
    }
    next();
};

app.post('/api/registro', [
    body('username').trim().isLength({ min: 3, max: 50 }).withMessage('El usuario debe tener entre 3 y 50 caracteres').matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ_ ]+$/).withMessage('El usuario solo puede contener letras, números, espacios y caracteres en español').escape(),
    body('email').trim().isEmail().withMessage('Debe ser un email válido').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    manejarErroresValidacion
], async (req, res) => {
    const { username, password, email } = req.body;
    try {
        const hashed = await bcrypt.hash(password, 10);
        db.run('INSERT INTO usuarios (username, password, email) VALUES (?, ?, ?)',
            [username, hashed, email],
            function (err) {
                if (err) {
                    if (err.code === 'SQLITE_CONSTRAINT') {
                        res.status(409).json({ error: 'El usuario o email ya existe' });
                    } else {
                        res.status(400).json({ error: 'Error al registrar usuario' });
                    }
                    return;
                }
                const token = jwt.sign({ id: this.lastID, username }, JWT_SECRET, { expiresIn: '24h' });
                res.json({ id: this.lastID, username, email, token });
            });
    } catch (e) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.post('/api/login', [
    body('email').trim().isEmail().withMessage('El email es requerido').normalizeEmail(),
    body('password').notEmpty().withMessage('La contraseña es requerida'),
    manejarErroresValidacion
], (req, res) => {
    const { email, password } = req.body;
    db.get('SELECT id, username, password FROM usuarios WHERE email = ?', [email], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la base de datos' });
        }
        if (!row) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        bcrypt.compare(password, row.password, (bcryptErr, same) => {
            if (bcryptErr) {
                return res.status(500).json({ error: 'Error en la autenticación' });
            }
            if (same) {
                const token = jwt.sign({ id: row.id, username: row.username }, JWT_SECRET, { expiresIn: '24h' });
                res.json({ id: row.id, username: row.username, token });
            } else {
                res.status(401).json({ error: 'Credenciales inválidas' });
            }
        });
    });
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
        });
});

app.post('/api/contact', [
    body('name').trim().notEmpty().withMessage('Nombre es requerido').escape(),
    body('email').trim().isEmail().withMessage('Email inválido').normalizeEmail(),
    body('subject').optional().trim().escape(),
    body('message').trim().notEmpty().withMessage('Mensaje es requerido').escape(),
    manejarErroresValidacion
], (req, res) => {
    const { name, email, subject, message } = req.body;
    const cleanSubject = subject || 'Sin asunto';

    db.run('INSERT INTO contactos (nombre, email, asunto, mensaje, fecha_envio) VALUES (?, ?, ?, ?, datetime("now"))',
        [name, email, cleanSubject, message],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Error al guardar contacto' });
            }
            const mailOptions = {
                from: process.env.SMTP_FROM || 'no-reply@certiwebs.local',
                to: process.env.CONTACT_RECIPIENT || 'octaarami@gmail.com',
                subject: `Nuevo mensaje de contacto - ${cleanSubject}`,
                text: `Has recibido un nuevo mensaje de contacto:\n\nNombre: ${name}\nEmail: ${email}\nAsunto: ${cleanSubject}\n\nMensaje:\n${message}`
            };

            if (process.env.SMTP_HOST && process.env.SMTP_USER) {
                transporter.sendMail(mailOptions, (mailErr, info) => {
                    if (mailErr) {
                        return res.json({ id: this.lastID, warning: 'Contacto guardado, fallo al enviar correo' });
                    }
                    res.json({ id: this.lastID });
                });
            } else {
                res.json({ id: this.lastID, info: 'Contacto guardado. SMTP no configurado, no se envió correo.' });
            }
        });
});

app.post('/api/newsletter', [
    body('email').trim().isEmail().withMessage('Debe ser un email válido').normalizeEmail(),
    manejarErroresValidacion
], (req, res) => {
    const { email } = req.body;
    db.run('INSERT INTO boletin (email) VALUES (?)', [email], function(err) {
        if (err) {
            if (err.code === 'SQLITE_CONSTRAINT') {
                return res.status(409).json({ error: 'Este correo ya está registrado en el boletín.' });
            }
            return res.status(500).json({ error: 'Error al procesar la suscripción.' });
        }
        res.json({ id: this.lastID, mensaje: '¡Suscripción exitosa al boletín técnico! 🎉' });
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
    const { usuario_id, examen_id } = req.body;

    if (req.usuario.id !== usuario_id) {
        return res.status(403).json({ error: 'No autorizado' });
    }

    const codigo = `CERT-${examen_id.toUpperCase()}-${Date.now()}`;
    db.run('INSERT INTO certificados (usuario_id, examen_id, codigo_verificacion) VALUES (?, ?, ?)',
        [usuario_id, examen_id, codigo],
        function (err) {
            if (err) {
                return res.status(400).json({ error: 'Error al crear certificado' });
            }
            res.json({ id: this.lastID, codigo_verificacion: codigo, mensaje: 'Certificado creado exitosamente' });
        });
});



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

module.exports = app;