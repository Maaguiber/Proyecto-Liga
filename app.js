const express = require("express");
const app = express();
const port = 3000;
const { getJugadoresController,postJugadoresController,putJugadoresController} = require("./controlador");

app.use(express.json());

app.get("/jugadores", getJugadoresController);  //trae todos, valida clubID y filtra cuando corresponde
app.post("/jugadores", postJugadoresController);  // crea un nuevo jugador y devuelve el jugador creadot el cliente ahora recibe mensajes de error específicos
app.put("/jugadores/:id", putJugadoresController); // Actualiza un jugador específico por ID


// Inicia el servidor y lo pone a escuchar en el puerto definido
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
