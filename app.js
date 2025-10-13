const express = require("express");
const connection = require("./dataBase"); // Importa la conexión a la DB
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);

  // Conectar a la base de datos cuando la app se inicializa
  connection.connect((err) => {
    if (err) {
      console.error("Error conectando a la base de datos:", err);
      return;
    }
    console.log("Conexión exitosa a la base de datos MySQL");
  });
});
