const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'passucci',
    database: 'holamundo'
});

function main() {
    connection.query('SHOW TABLES', (err, results) => {
        if (err) console.error(err);
        else {
            for (let i = 0; i < results.length; i++) {
                console.log(Object.values(results[i])[0]);
            }
        }
        connection.end();
    });
}

main();

module.exports = connection;