const fs = require('fs');
const path = require('path');

const src = 'C:/Users/Octavio/.gemini/antigravity-ide/brain/4016b64a-128e-4ddf-b216-8535024a4608/medal_valida_1784408160562.png';
const dest = path.join(__dirname, 'public/images/medal_valida.png');

try {
    // Asegurar que el directorio de destino existe
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
    console.log('✅ Imagen copiada con éxito a:', dest);
} catch (err) {
    console.error('❌ Error al copiar la imagen:', err.message);
}
