const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

// Conectar a la base de datos
const dbPath = path.join(__dirname, '..', 'certiweb.db');
const db = new sqlite3.Database(dbPath);

// Sample data
const sampleUsers = [
    { username: 'admin', password: 'admin123', email: 'admin@certiwebs.com' },
    { username: 'juanperez', password: '12345', email: 'juan.perez@email.com' },
    { username: 'mariagarcia', password: 'abcde', email: 'maria.garcia@email.com' },
    { username: 'carlosrodriguez', password: 'pass123', email: 'carlos.rodriguez@email.com' },
    { username: 'anamartinez', password: '123', email: 'ana.martinez@email.com' },
    { username: 'luislopez', password: 'qwerty', email: 'luis.lopez@email.com' },
    { username: 'sofiafernandez', password: '1234', email: 'sofia.fernandez@email.com' },
    { username: 'diegogomez', password: 'password', email: 'diego.gomez@email.com' },
    { username: 'luciahernandez', password: 'pass', email: 'lucia.hernandez@email.com' },
    { username: 'pedrojimenez', password: '123456', email: 'pedro.jimenez@email.com' }
];

const sampleContacts = [
    { nombre: 'Roberto Silva', email: 'roberto.silva@empresa.com', asunto: 'Consulta sobre certificaciones', mensaje: 'Estoy interesado en obtener certificaciones en redes y sistemas operativos.' },
    { nombre: 'Laura Morales', email: 'laura.morales@tech.com', asunto: 'Sugerencia', mensaje: 'Me gustaría que agregaran más exámenes sobre programación avanzada.' },
    { nombre: 'Miguel Ángel Torres', email: 'mtorres@universidad.edu', asunto: 'Colaboración', mensaje: 'Somos una universidad interesada en usar su plataforma para nuestros estudiantes.' },
    { nombre: 'Carmen Valdez', email: 'carmen.v@consultora.com', asunto: 'Soporte técnico', mensaje: 'Tengo problemas para acceder a mis certificados anteriores.' },
    { nombre: 'Fernando Castillo', email: 'f.castillo@startup.tech', asunto: 'Información', mensaje: '¿Ofrecen certificaciones para equipos corporativos?' }
];

const sampleCertificates = [
    { usuario_id: 2, examen_id: 'html', codigo_verificacion: 'CERT-HTML-2025-001' },
    { usuario_id: 2, examen_id: 'css', codigo_verificacion: 'CERT-CSS-2025-002' },
    { usuario_id: 3, examen_id: 'js', codigo_verificacion: 'CERT-JS-2025-003' },
    { usuario_id: 4, examen_id: 'redes', codigo_verificacion: 'CERT-RED-2025-004' },
    { usuario_id: 5, examen_id: 'so', codigo_verificacion: 'CERT-SO-2025-005' },
    { usuario_id: 6, examen_id: 'html', codigo_verificacion: 'CERT-HTML-2025-006' },
    { usuario_id: 7, examen_id: 'css', codigo_verificacion: 'CERT-CSS-2025-007' },
    { usuario_id: 8, examen_id: 'js', codigo_verificacion: 'CERT-JS-2025-008' }
];

const sampleExamResults = [
    { usuario_id: 2, examen_id: 'html', puntuacion: 95 },
    { usuario_id: 2, examen_id: 'css', puntuacion: 88 },
    { usuario_id: 3, examen_id: 'js', puntuacion: 92 },
    { usuario_id: 4, examen_id: 'redes', puntuacion: 76 },
    { usuario_id: 5, examen_id: 'so', puntuacion: 85 },
    { usuario_id: 6, examen_id: 'html', puntuacion: 90 },
    { usuario_id: 7, examen_id: 'css', puntuacion: 82 },
    { usuario_id: 8, examen_id: 'js', puntuacion: 78 },
    { usuario_id: 9, examen_id: 'redes', puntuacion: 94 },
    { usuario_id: 10, examen_id: 'so', puntuacion: 87 }
];

async function seedDatabase() {
    console.log('Iniciando carga de datos de muestra...');
    
    try {
        // Insertar usuarios
        for (const user of sampleUsers) {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            
            db.run('INSERT OR IGNORE INTO usuarios (username, password, email) VALUES (?, ?, ?)', 
                [user.username, hashedPassword, user.email], 
                function(err) {
                    if (err) {
                        console.error('Error insertando usuario:', user.username, err);
                    } else if (this.changes > 0) {
                        console.log('Usuario insertado:', user.username);
                    }
                }
            );
        }

        // Insertar contactos
        setTimeout(() => {
            sampleContacts.forEach(contact => {
                db.run('INSERT OR IGNORE INTO contactos (nombre, email, asunto, mensaje) VALUES (?, ?, ?, ?)', 
                    [contact.nombre, contact.email, contact.asunto, contact.mensaje], 
                    function(err) {
                        if (err) {
                            console.error('Error insertando contacto:', contact.nombre, err);
                        } else if (this.changes > 0) {
                            console.log('Contacto insertado:', contact.nombre);
                        }
                    }
                );
            });
        }, 1000);

        // Insertar certificados
        setTimeout(() => {
            sampleCertificates.forEach(cert => {
                db.run('INSERT OR IGNORE INTO certificados (usuario_id, examen_id, codigo_verificacion) VALUES (?, ?, ?)', 
                    [cert.usuario_id, cert.examen_id, cert.codigo_verificacion], 
                    function(err) {
                        if (err) {
                            console.error('Error insertando certificado:', cert.codigo_verificacion, err);
                        } else if (this.changes > 0) {
                            console.log('Certificado insertado:', cert.codigo_verificacion);
                        }
                    }
                );
            });
        }, 2000);

        // Insertar resultados de exámenes
        setTimeout(() => {
            sampleExamResults.forEach(result => {
                db.run('INSERT OR IGNORE INTO examenes_completados (usuario_id, examen_id, puntuacion) VALUES (?, ?, ?)', 
                    [result.usuario_id, result.examen_id, result.puntuacion], 
                    function(err) {
                        if (err) {
                            console.error('Error insertando resultado:', result.usuario_id, result.examen_id, err);
                        } else if (this.changes > 0) {
                            console.log('Resultado insertado: Usuario', result.usuario_id, '-', result.examen_id, '-', result.puntuacion + '%');
                        }
                    }
                );
            });
        }, 3000);

        // Cerrar conexión después de completar
        setTimeout(() => {
            console.log('Carga de datos completada.');
            db.close();
        }, 5000);

    } catch (error) {
        console.error('Error en la carga de datos:', error);
        db.close();
    }
}

// Ejecutar la carga de datos
seedDatabase();
