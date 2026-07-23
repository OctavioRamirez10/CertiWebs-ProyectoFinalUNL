const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '..', 'server', 'data.db');

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) return console.error('Error abriendo DB:', err.message);
});

function query(sql) {
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

(async () => {
  try {
    console.log('DB:', dbPath);
    const usuarios = await query('SELECT id, username, email, fecha_registro FROM usuarios ORDER BY id');
    console.log('\nUsuarios:');
    console.table(usuarios);

    const examenes = await query('SELECT id, usuario_id, examen_id, puntuacion, fecha FROM examenes_completados ORDER BY fecha DESC LIMIT 20');
    console.log('\nExamenes completados (últimos 20):');
    console.table(examenes);

    const certificados = await query('SELECT id, usuario_id, examen_id, codigo_verificacion, fecha_emision FROM certificados ORDER BY fecha_emision DESC LIMIT 20');
    console.log('\nCertificados (últimos 20):');
    console.table(certificados);
  } catch (e) {
    console.error('Error consultando DB:', e);
  } finally {
    db.close();
  }
})();
