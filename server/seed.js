const db = require('./database');
const bcrypt = require('bcrypt');

const sampleUsers = [
    { username: 'ana', password: 'Ana12345', email: 'ana@example.com' },
    { username: 'juan', password: 'Juan12345', email: 'juan@example.com' },
    { username: 'maria', password: 'Maria12345', email: 'maria@example.com' }
];

function randomCode(len = 10) {
    return [...Array(len)].map(() => Math.floor(Math.random() * 36).toString(36)).join('').toUpperCase();
}

db.serialize(async () => {
    console.log('Poblando base de datos con datos de ejemplo (server/seed.js)...');

    for (const u of sampleUsers) {
        try {
            const hashed = await bcrypt.hash(u.password, 10);
            await new Promise((resolve, reject) => {
                db.run('INSERT OR IGNORE INTO usuarios (username, password, email) VALUES (?, ?, ?)', [u.username, hashed, u.email], function (err) {
                    if (err) return reject(err);
                    resolve(this.lastID);
                });
            });

            // Obtener el id del usuario
            const id = await new Promise((resolve, reject) => {
                db.get('SELECT id FROM usuarios WHERE username = ?', [u.username], (err, row) => {
                    if (err) return reject(err);
                    resolve(row.id);
                });
            });

            // Insertar algunos resultados de exámenes
            const exams = [
                { examen_id: 'html', puntuacion: Math.floor(Math.random() * 50) + 50 },
                { examen_id: 'css', puntuacion: Math.floor(Math.random() * 50) + 50 },
                { examen_id: 'js', puntuacion: Math.floor(Math.random() * 50) + 50 }
            ];

            for (const e of exams) {
                await new Promise((resolve, reject) => {
                    db.run('INSERT INTO examenes_completados (usuario_id, examen_id, puntuacion) VALUES (?, ?, ?)', [id, e.examen_id, e.puntuacion], function (err) {
                        if (err) return reject(err);
                        resolve(this.lastID);
                    });
                });

                // Si aprobó (>=60) crear certificado
                if (e.puntuacion >= 60) {
                    const code = randomCode(12);
                    await new Promise((resolve, reject) => {
                        db.run('INSERT OR IGNORE INTO certificados (usuario_id, examen_id, codigo_verificacion) VALUES (?, ?, ?)', [id, e.examen_id, code], function (err) {
                            if (err) return reject(err);
                            resolve(this.lastID);
                        });
                    });
                }
            }

            // Insertar un contacto de ejemplo para el usuario
            await new Promise((resolve, reject) => {
                db.run('INSERT INTO contactos (nombre, email, mensaje, fecha_preferida) VALUES (?, ?, ?, ?)', [u.username, u.email, 'Mensaje de ejemplo desde seed', null], function (err) {
                    if (err) return reject(err);
                    resolve(this.lastID);
                });
            });

            console.log(`Usuario '${u.username}' asegurado/insertado con datos de ejemplo.`);
        } catch (err) {
            console.error('Error al insertar usuario', u.username, err);
        }
    }

    console.log('Seed finalizado.');
});
