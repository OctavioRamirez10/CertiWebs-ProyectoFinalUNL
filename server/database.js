const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

// Ubicación del fichero DB: en la raíz del proyecto
const dbPath = path.join(__dirname, '..', 'certiweb.db');
const db = new sqlite3.Database(dbPath);

// Crear tablas
db.serialize(() => {
    // Tabla de usuarios
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        email TEXT,
        fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tabla de exámenes completados
    db.run(`CREATE TABLE IF NOT EXISTS examenes_completados (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER,
        examen_id TEXT,
        puntuacion INTEGER,
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
    )`);

    // Tabla de certificados
    db.run(`CREATE TABLE IF NOT EXISTS certificados (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER,
        examen_id TEXT,
        fecha_emision DATETIME DEFAULT CURRENT_TIMESTAMP,
        codigo_verificacion TEXT UNIQUE,
        FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
    )`);

    // Tabla de contactos enviados desde el formulario
    db.run(`CREATE TABLE IF NOT EXISTS contactos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        email TEXT,
        asunto TEXT,
        mensaje TEXT,
        fecha_preferida DATETIME,
        fecha_envio DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Insertar usuarios predefinidos si no existen
    const usuariosPredefinidos = [
        {
            username: 'octavio',
            password: 'Admin_123!',
            email: 'octavio@certiwebs.com'
        },
        {
            username: 'usuario_demo',
            password: 'Demo_123!',
            email: 'demo@certiwebs.com'
        },
        {
            username: 'Administrador',
            password: 'Admin_1234!',
            email: 'admin@certiwebs.com'
        }
    ];

    // Función para insertar usuarios predefinidos
    async function insertarUsuariosPredefinidos() {
        for (const usuario of usuariosPredefinidos) {
            // Verificar si el usuario ya existe
            db.get('SELECT id FROM usuarios WHERE username = ?', [usuario.username], async (err, row) => {
                if (!err && !row) {
                    // Usuario no existe, lo creamos
                    try {
                        const hashedPassword = await bcrypt.hash(usuario.password, 10);
                        db.run('INSERT INTO usuarios (username, password, email) VALUES (?, ?, ?)',
                            [usuario.username, hashedPassword, usuario.email],
                            function(err) {
                                if (!err) {
                                    console.log(`Usuario predefinido creado: ${usuario.username}`);
                                }
                            });
                    } catch (hashErr) {
                        console.error('Error hashing password:', hashErr);
                    }
                } else if (row) {
                    console.log(`Usuario predefinido ya existe: ${usuario.username}`);
                }
            });
        }
    }

    // Insertar usuarios predefinidos después de crear las tablas
    setTimeout(insertarUsuariosPredefinidos, 1000);
});

module.exports = db;
