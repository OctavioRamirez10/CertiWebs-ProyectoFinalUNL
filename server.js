const express = require('express');
const bodyParser = require('body-parser');
const db = require('./server/database');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
require('dotenv').config();
const path = require('path');

const app = express();

// Clave estática para panel admin (puedes cambiarla en .env)
const ADMIN_KEY = process.env.ADMIN_KEY || 'admin1234';

function adminAuth(req, res, next) {
    const key = req.headers['x-admin-key'] || req.query.admin_key || req.body && req.body.admin_key;
    if (!key || key !== ADMIN_KEY) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    next();
}

// Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
// Servir contenidos estáticos desde /public
app.use(express.static(path.join(__dirname, 'public')));

// Habilitar CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Transporter de nodemailer (config via .env)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    } : undefined
});

// Registro de usuario
app.post('/api/registro', async (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
        res.status(400).json({ error: 'Faltan campos obligatorios' });
        return;
    }
    try {
        const hashed = await bcrypt.hash(password, 10);
        db.run('INSERT INTO usuarios (username, password, email) VALUES (?, ?, ?)',
            [username, hashed, email],
            function (err) {
                if (err) {
                    console.error('DB registro error:', err);
                    if (err.code === 'SQLITE_CONSTRAINT') {
                        res.status(409).json({ error: 'El usuario o email ya existe' });
                    } else {
                        res.status(400).json({ error: 'Error al registrar usuario' });
                    }
                    return;
                }
                res.json({ id: this.lastID, username, email });
            });
    } catch (e) {
        console.error('Hash error:', e);
        res.status(500).json({ error: 'Error interno' });
    }
});

// Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ error: 'Faltan campos' });
        return;
    }
    db.get('SELECT id, username, password FROM usuarios WHERE username = ?', [username], (err, row) => {
        if (err) {
            console.error('DB login error:', err);
            res.status(500).json({ error: 'Error en la autenticación' });
            return;
        }
        if (!row) {
            res.status(401).json({ error: 'Credenciales inválidas' });
            return;
        }
        bcrypt.compare(password, row.password, (bcryptErr, same) => {
            if (bcryptErr) {
                console.error('bcrypt error:', bcryptErr);
                res.status(500).json({ error: 'Error en la autenticación' });
                return;
            }
            if (same) {
                res.json({ 
                    id: row.id, 
                    username: row.username,
                    token: Buffer.from(`${row.id}:${Date.now()}`).toString('base64')
                });
            } else {
                res.status(401).json({ error: 'Credenciales inválidas' });
            }
        });
    });
});

// Guardar resultado de examen
app.post('/api/examenes', (req, res) => {
    const { usuario_id, examen_id, puntuacion } = req.body;
    
    if (!usuario_id || !examen_id || puntuacion === undefined) {
        res.status(400).json({ error: 'Faltan campos obligatorios' });
        return;
    }
    
    if (typeof puntuacion !== 'number' || puntuacion < 0 || puntuacion > 100) {
        res.status(400).json({ error: 'La puntuación debe ser un número entre 0 y 100' });
        return;
    }
    
    db.run('INSERT INTO examenes_completados (usuario_id, examen_id, puntuacion) VALUES (?, ?, ?)',
        [usuario_id, examen_id, puntuacion],
        function (err) {
            if (err) {
                console.error('Error guardando examen:', err);
                res.status(400).json({ error: 'Error al guardar resultado' });
                return;
            }
            res.json({ id: this.lastID, mensaje: 'Resultado guardado exitosamente' });
        });
});

// Endpoint para contacto: guarda en DB y envía correo
app.post('/api/contact', (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    // Guardar en SQLite
    db.run('INSERT INTO contactos (nombre, email, asunto, mensaje, fecha_envio) VALUES (?, ?, ?, ?, datetime("now"))',
        [name, email, subject || 'Sin asunto', message],
        function(err) {
            if (err) {
                console.error('DB error saving contact:', err);
                res.status(500).json({ error: 'Error al guardar contacto' });
                return;
            }

            // Enviar correo (si está configurado)
            const mailOptions = {
                from: process.env.SMTP_FROM || 'no-reply@certiwebs.local',
                to: process.env.CONTACT_RECIPIENT || 'octaarami@gmail.com',
                subject: `Nuevo mensaje de contacto - ${subject || 'Sin asunto'}`,
                text: `Has recibido un nuevo mensaje de contacto:\n\nNombre: ${name}\nEmail: ${email}\nAsunto: ${subject || 'Sin asunto'}\n\nMensaje:\n${message}`
            };

            if (process.env.SMTP_HOST && process.env.SMTP_USER) {
                transporter.sendMail(mailOptions, (mailErr, info) => {
                    if (mailErr) {
                        console.error('Error enviando correo:', mailErr);
                        // No fallamos la petición por el correo; respondemos OK pero con aviso
                        res.json({ id: this.lastID, warning: 'Contacto guardado, fallo al enviar correo' });
                        return;
                    }
                    res.json({ id: this.lastID });
                });
            } else {
                // Si no está configurado SMTP, responder OK y dejar registro en DB
                res.json({ id: this.lastID, info: 'Contacto guardado. SMTP no configurado, no se envió correo.' });
            }
        });
});

// Obtener certificados de usuario
app.get('/api/certificados/:usuario_id', (req, res) => {
    const { usuario_id } = req.params;
    db.all('SELECT * FROM certificados WHERE usuario_id = ?',
        [usuario_id],
        (err, rows) => {
            if (err) {
                res.status(400).json({ error: 'Error al obtener certificados' });
                return;
            }
            res.json(rows);
        });
});

// Rutas admin protegidas por ADMIN_KEY
app.get('/api/admin/contacts', adminAuth, (req, res) => {
    db.all('SELECT * FROM contactos ORDER BY fecha_envio DESC', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Error al obtener contactos' });
            return;
        }
        res.json(rows);
    });
});

app.get('/api/admin/certificados', adminAuth, (req, res) => {
    db.all('SELECT * FROM certificados ORDER BY fecha_emision DESC', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Error al obtener certificados' });
            return;
        }
        res.json(rows);
    });
});

// Crear certificado automáticamente
app.post('/api/certificados', (req, res) => {
    const { usuario_id, examen_id } = req.body;
    
    if (!usuario_id || !examen_id) {
        res.status(400).json({ error: 'Faltan campos obligatorios' });
        return;
    }
    
    // Generar código de verificación único
    const codigo = `CERT-${examen_id.toUpperCase()}-${Date.now()}`;
    
    db.run('INSERT INTO certificados (usuario_id, examen_id, codigo_verificacion) VALUES (?, ?, ?)',
        [usuario_id, examen_id, codigo],
        function (err) {
            if (err) {
                console.error('Error creando certificado:', err);
                res.status(400).json({ error: 'Error al crear certificado' });
                return;
            }
            res.json({ 
                id: this.lastID, 
                codigo_verificacion: codigo,
                mensaje: 'Certificado creado exitosamente' 
            });
        });
});

// Agregar ruta para obtener historial de exámenes
app.get('/api/examenes/:usuario_id', (req, res) => {
    const { usuario_id } = req.params;
    db.all('SELECT * FROM examenes_completados WHERE usuario_id = ? ORDER BY fecha DESC',
        [usuario_id],
        (err, rows) => {
            if (err) {
                res.status(400).json({ error: 'Error al obtener historial' });
                return;
            }
            res.json(rows);
        });
});

const PORT = process.env.PORT || 3000;

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error global:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Middleware para rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log('Base de datos inicializada y lista para usar');
});