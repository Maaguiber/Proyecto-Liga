const express = require("express");
const { traerJugadores } = require("./repositorio");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  // Envía un mensaje de prueba al navegador
  res.send("Hello World!");
});

//endpoint
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

//crear jugador
//tiene que recibir lo necesario salvo el ID,
//debe ser asyncrona
//va a recibir tambien un clubId, tiene que validar primero que ese club exista
//COmo se va a validr que exista el club? vas a buscar el club POR ID EN EL REPO y en caso de que no exista,
//la api va a devolver un mensaje de "El club solicitado no existe"
//esto sew va a tener que probar en postman ya que hay que pasarle un body

//pasarme el CURL que le pega a este endpoint

app.post("/jugadores", async (req, res) => {
  console.log(req);
  console.log(req.body);
});

//se le pasa el id del jugador en la url
//con ese id primero:
//buscamos el jugador en el repo, en caso de no existir, devolver mensaje de error con status 404
//en el body van a viajar los campos a actualizar
//vas a crer para actualizar una funcion en el repositorio que va a recibir dos paramatros:
//1: el id del jugador
//2: los campos a actualizar
//la funcion en caso de funciuonar va a devolver un mensaje de exito con status 200 y va a devolver el jugador actualizado
app.put("/jugadores/:id", async (req, res) => {});

// Inicia el servidor y lo pone a escuchar en el puerto definido
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
