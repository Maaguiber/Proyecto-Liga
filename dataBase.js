const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'passucci',
    database: 'holamundo'
});

function main() {
    // Ejecuta la consulta para listar todas las tablas
    connection.query('SHOW TABLES', (err, results) => {
        if (err) console.error(err); // Muestra error si ocurre
        else {
            // Recorre los resultados y muestra el nombre de cada tabla
            for (let i = 0; i < results.length; i++) {
                console.log(Object.values(results[i])[0]);
            }
        }
        connection.end(); // Cierra la conexión a la base de datos
    });
}

main(); // Llama a la función principal

module.exports = connection; // Exporta la conexión para usarla en otros archivos