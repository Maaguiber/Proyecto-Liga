const mysql = require("mysql2/promise"); // versión compatible con async/await

// Pool de conexiones para que se puedan hacer varias consultas sin cerrar la conexión
const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "passucci",
  database: "holamundo",
});


module.exports = connection;

