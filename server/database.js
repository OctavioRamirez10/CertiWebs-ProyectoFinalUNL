const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

// Ubicación del fichero DB: por defecto dentro de la carpeta server (server/data.db)
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'data.db');

// Asegurar que el directorio de la base de datos existe
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath);

console.log('Usando base de datos SQLite en:', dbPath);

// Crear tablas y aplicar migraciones de forma serializada
db.serialize(() => {
    // Tabla de usuarios (con columna rol)
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        email TEXT UNIQUE,
        rol TEXT DEFAULT 'usuario',
        fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Migración segura: agregar columna rol si no existe (para BDs creadas antes)
    db.run(`ALTER TABLE usuarios ADD COLUMN rol TEXT DEFAULT 'usuario'`, (err) => {
        if (err && !err.message.includes('duplicate column')) {
            // Si el error no es "duplicate column", lo ignoramos silenciosamente
        }
    });

    // Migración segura: agregar UNIQUE a email si la tabla ya existía sin él
    // (SQLite no permite ALTER COLUMN, así que solo aseguramos el índice)
    db.run(`CREATE UNIQUE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email)`);

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

    // Tabla de contactos
    db.run(`CREATE TABLE IF NOT EXISTS contactos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        email TEXT,
        asunto TEXT,
        mensaje TEXT,
        fecha_preferida DATETIME,
        fecha_envio DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tabla de suscripciones (newsletter)
    db.run(`CREATE TABLE IF NOT EXISTS suscripciones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        fecha_subscripcion DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tabla de boletín de novedades
    db.run(`CREATE TABLE IF NOT EXISTS boletin (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        fecha_suscripcion DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Usuarios predefinidos: admin + demos
    const usuariosPredefinidos = [
        {
            username: 'admin',
            password: 'Admin_1234!',
            email: 'admin@certiwebs.com',
            rol: 'admin'
        },
        {
            username: 'octavio',
            password: 'Admin_123!',
            email: 'octavio@certiwebs.com',
            rol: 'admin'
        },
        {
            username: 'Administrador',
            password: 'Admin_1234!',
            email: 'administrador@certiwebs.com',
            rol: 'admin'
        },
        {
            username: 'usuario_demo',
            password: 'Demo_123!',
            email: 'demo@certiwebs.com',
            rol: 'usuario'
        }
    ];

    async function insertarUsuariosPredefinidos() {
        for (const usuario of usuariosPredefinidos) {
            db.get('SELECT id, rol FROM usuarios WHERE username = ? OR email = ?',
                [usuario.username, usuario.email],
                async (err, row) => {
                    if (!err && !row) {
                        // Usuario no existe, crearlo
                        try {
                            const hashedPassword = await bcrypt.hash(usuario.password, 10);
                            db.run(
                                'INSERT INTO usuarios (username, password, email, rol) VALUES (?, ?, ?, ?)',
                                [usuario.username, hashedPassword, usuario.email, usuario.rol],
                                function(insertErr) {
                                    if (!insertErr) {
                                        console.log(`✅ Usuario predefinido creado: ${usuario.username} [${usuario.rol}]`);
                                    } else {
                                        console.error(`Error creando ${usuario.username}:`, insertErr.message);
                                    }
                                }
                            );
                        } catch (hashErr) {
                            console.error('Error hashing password:', hashErr);
                        }
                    } else if (row) {
                        // Actualizar rol si es necesario (para usuarios ya existentes que deben ser admin)
                        if (usuario.rol === 'admin' && row.rol !== 'admin') {
                            db.run('UPDATE usuarios SET rol = ? WHERE id = ?', ['admin', row.id], () => {
                                console.log(`🔄 Rol actualizado a admin para: ${usuario.username}`);
                            });
                        } else {
                            console.log(`✓ Usuario ya existe: ${usuario.username}`);
                        }
                    }
                }
            );
        }
    }

    // Insertar/actualizar usuarios predefinidos después de crear las tablas
    setTimeout(insertarUsuariosPredefinidos, 500);
});

module.exports = db;
