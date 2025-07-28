const fs = require('fs')

async function guardarArchivo(nombreDeArchivo, data) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(nombreDeArchivo, data, function (err) {
            if (err) reject(err);
            else resolve(data);
        });
    });
}

function leedorDeArchivo(nombreDeArchivo, data) {
    fs.readFile(nombreDeArchivo, 'utf-8', (error, data) => {
        if (!error) {
            console.log(data);
        } else (console.log('Error: ${error}'));
    })
}

module.exports = {
    guardarArchivo,
    leedorDeArchivo
}

// '<file-encoding>'
// '<encoding>'
// 'uft8'

