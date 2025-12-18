const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Conectar a la base de datos
const dbPath = path.join(__dirname, '..', 'certiweb.db');
const db = new sqlite3.Database(dbPath);

// Agregar columna asunto si no existe
db.run(`ALTER TABLE contactos ADD COLUMN asunto TEXT`, (err) => {
    if (err) {
        if (err.message.includes('duplicate column name')) {
            console.log('La columna "asunto" ya existe en la tabla contactos');
        } else {
            console.error('Error agregando columna asunto:', err);
        }
    } else {
        console.log('Columna "asunto" agregada exitosamente a la tabla contactos');
    }
    
    db.close();
});
