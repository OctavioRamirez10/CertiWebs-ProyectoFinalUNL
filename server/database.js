const sqlite3 = require('sqlite3').verbose();
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
});

module.exports = db;
