const express = require("express");
const app = express();
const port = 3000;
const { getJugadoresController,postJugadoresController,putJugadoresController} = require("./controlador");

app.use(express.json());


app.get("/jugadores", getJugadoresController);  //trae todos, valida clubID y filtra cuando corresponde
app.post("/jugadores", postJugadoresController);  // crea un nuevo jugador y devuelve el jugador creado, incluyendo su id
app.put("/jugadores/:id", putJugadoresController); //actualiza los campos que envíes en el body y el resto de los datos quedan igual


// Inicia el servidor y lo pone a escuchar en el puerto definido
//CONSIGNA
// la base de datos debe inicializarse ni bien levanta la app, es indispensable para que funcione cualquier endpoint
// 1- que la base de datos se inicialice aca adentro, buscar en la libreria que levanta la db una forma de hacerlo aca adentro(*)
//2 agregar un console log "Base de datos conectada.", si falla la conexion que diga "Error al intentar conectar con la base de datos"
//
app.listen(port, () => {
  //ACA (*)
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
