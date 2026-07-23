const db = require('./database');

console.log("Inicializando base de datos...");
// database.js inicializa las tablas e inserta los usuarios de forma automática.
setTimeout(() => {
    console.log("Base de datos inicializada y poblada con datos de prueba.");
    db.close();
    process.exit(0);
}, 2000);
