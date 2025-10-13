const express = require("express");
const { traerJugadores } = require("./repositorio");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  // Envía un mensaje de prueba al navegador
  res.send("Hello World!");
});

app.get("/jugadores", async (req, res) => {
  try {
    // Llama a la función que obtiene los jugadores de la base de datos
    const jugadores = await traerJugadores();
    // Devuelve los jugadores en formato JSON
    res.json(jugadores);
  } catch (error) {
    console.error("Error al obtener jugadores:", error);
    // Devuelve un mensaje de error al cliente
    res.status(500).json({ error: "Error al obtener jugadores" });
  }
});

// Inicia el servidor y lo pone a escuchar en el puerto definido
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

