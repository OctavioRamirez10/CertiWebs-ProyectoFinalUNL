/**
 * Script de migración y reparación de la base de datos CertiWebs.
 * Ejecutar con: node server/migrate.js
 */
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'data.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error abriendo BD:', err.message);
        process.exit(1);
    }
    console.log('✅ BD abierta:', dbPath);
});

db.serialize(async () => {
    // 1. Agregar columna rol si no existe
    db.run(`ALTER TABLE usuarios ADD COLUMN rol TEXT DEFAULT 'usuario'`, (err) => {
        if (err) {
            if (err.message.includes('duplicate column')) {
                console.log('ℹ️  Columna rol ya existe (OK)');
            } else {
                console.error('Error al agregar columna rol:', err.message);
            }
        } else {
            console.log('✅ Columna rol agregada correctamente');
        }
    });

    // 2. Actualizar rol de usuarios admin existentes
    const adminsExistentes = ['octavio', 'Administrador'];
    adminsExistentes.forEach(username => {
        db.run(`UPDATE usuarios SET rol = 'admin' WHERE username = ? AND (rol IS NULL OR rol != 'admin')`,
            [username],
            function(err) {
                if (err) {
                    console.error(`Error actualizando rol de ${username}:`, err.message);
                } else if (this.changes > 0) {
                    console.log(`✅ Rol admin asignado a: ${username}`);
                } else {
                    console.log(`ℹ️  ${username} ya tiene rol correcto o no existe`);
                }
            }
        );
    });

    // 3. Crear usuario admin si no existe
    db.get('SELECT id FROM usuarios WHERE username = ?', ['admin'], async (err, row) => {
        if (err) { console.error(err); return; }
        if (!row) {
            try {
                const hashed = await bcrypt.hash('Admin_1234!', 10);
                db.run(
                    `INSERT INTO usuarios (username, password, email, rol) VALUES (?, ?, ?, ?)`,
                    ['admin', hashed, 'admin@certiwebs.com', 'admin'],
                    function(insertErr) {
                        if (insertErr) {
                            console.error('Error creando admin:', insertErr.message);
                        } else {
                            console.log('✅ Usuario admin creado (username: admin, password: Admin_1234!)');
                        }
                    }
                );
            } catch(e) { console.error(e); }
        } else {
            // Asegurarse de que tiene rol admin
            db.run(`UPDATE usuarios SET rol = 'admin' WHERE username = 'admin'`, () => {
                console.log('ℹ️  Usuario admin ya existe, rol verificado');
            });
        }
    });

    // 4. Mostrar resumen de usuarios
    setTimeout(() => {
        db.all(`SELECT id, username, email, rol FROM usuarios ORDER BY id`, [], (err, rows) => {
            if (err) { console.error(err); return; }
            console.log('\n📋 Usuarios en la base de datos:');
            console.log('─'.repeat(70));
            rows.forEach(u => {
                const rolLabel = u.rol === 'admin' ? '🛡 ADMIN' : '👤 usuario';
                console.log(`  ID:${u.id} | ${u.username.padEnd(20)} | ${(u.email || '').padEnd(30)} | ${rolLabel}`);
            });
            console.log('─'.repeat(70));
            console.log('\n✅ Migración completada. Reiniciá el servidor con: npm start\n');
            db.close();
            process.exit(0);
        });
    }, 1500);
});
