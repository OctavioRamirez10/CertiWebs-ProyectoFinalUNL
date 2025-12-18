const db = require('./database');

console.log('Verificando estructura de la base de datos...');

// Verificar tablas
db.all('SELECT name FROM sqlite_master WHERE type="table"', [], (err, rows) => {
    if (err) {
        console.error('Error:', err);
        return;
    }
    console.log('Tablas encontradas:', rows.map(r => r.name));
    
    // Verificar estructura de tabla usuarios
    db.all('PRAGMA table_info(usuarios)', [], (err, columns) => {
        if (err) {
            console.error('Error en usuarios:', err);
            return;
        }
        console.log('\nEstructura tabla usuarios:');
        columns.forEach(col => console.log(`- ${col.name}: ${col.type}`));
    });
    
    // Verificar estructura de tabla examenes_completados
    db.all('PRAGMA table_info(examenes_completados)', [], (err, columns) => {
        if (err) {
            console.error('Error en examenes_completados:', err);
            return;
        }
        console.log('\nEstructura tabla examenes_completados:');
        columns.forEach(col => console.log(`- ${col.name}: ${col.type}`));
    });
    
    // Verificar estructura de tabla certificados
    db.all('PRAGMA table_info(certificados)', [], (err, columns) => {
        if (err) {
            console.error('Error en certificados:', err);
            return;
        }
        console.log('\nEstructura tabla certificados:');
        columns.forEach(col => console.log(`- ${col.name}: ${col.type}`));
    });
    
    // Contar registros
    setTimeout(() => {
        db.get('SELECT COUNT(*) as count FROM usuarios', [], (err, row) => {
            if (!err) console.log('\nUsuarios registrados:', row.count);
        });
        
        db.get('SELECT COUNT(*) as count FROM examenes_completados', [], (err, row) => {
            if (!err) console.log('Exámenes completados:', row.count);
        });
        
        db.get('SELECT COUNT(*) as count FROM certificados', [], (err, row) => {
            if (!err) console.log('Certificados emitidos:', row.count);
        });
        
        db.close();
    }, 1000);
});
