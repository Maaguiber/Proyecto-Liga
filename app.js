const express = require("express"); // Importa Express
const app = express(); // Crea la aplicación Express
const port = 3000; // Define el puerto del servidor
app.use(express.json()); // Permite leer JSON en el body de las requests
const jugadoresController = require("./controlador")// Importa todas las funciones del controlador como un objeto
const connection = require("./database"); // Importa la conexión a la base de datos

// Rutas
app.get("/jugadores", jugadoresController.getJugadores); // Trae todos los jugadores o solo filtra por clubID si viene como query param
app.get("/jugadores/:id", jugadoresController.getJugadorPorId); // Trae un jugador específico por id
app.post("/jugadores", jugadoresController.crearJugador); // Crea un nuevo jugador
app.put("/jugadores/:id", jugadoresController.actualizarJugador); // Actualiza un jugador existente

app.listen(port, () => {
  // Inicializamos la base de datos
  connection.getConnection()
    .then(() => console.log("Base de datos conectada."))
    .catch(() => console.log("Error al intentar conectar con la base de datos"));

  console.log(`Servidor escuchando en http://localhost:${port}`);
});
