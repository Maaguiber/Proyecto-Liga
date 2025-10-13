const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "passucci",
  database: "holamundo",
});

module.exports = connection; // Exporta la conexión para usarla en otros archivos
