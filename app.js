const express = require("express");
const app = express();
const port = 3000;
const { getJugadoresController,postJugadoresController,putJugadoresController} = require("./controlador");

app.use(express.json());

app.get("/jugadores", getJugadoresController);  //trae todos, valida clubID y filtra cuando corresponde
app.post("/jugadores", postJugadoresController);  // crea un nuevo jugador y devuelve el jugador creado, incluyendo su id
app.put("/jugadores/:id", putJugadoresController); //actualiza los campos que envíes en el body y el resto de los datos quedan igual


// Inicia el servidor y lo pone a escuchar en el puerto definido
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
