const express = require("express");
const { traerJugadores, crearJugador, traerClubPorId,actualizarJugador } = require("./repositorio");
const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/jugadores", async (req, res) => {
  try {
    const { clubID } = req.query;
    let jugadores = await traerJugadores();

    if (clubID) {
      jugadores = jugadores.filter(jugador => jugador.club_id == clubID);
    }

    res.json(jugadores);
  } catch (error) {
    console.error("Error al obtener jugadores:", error);
    res.status(500).json({ error: "Error al obtener jugadores" });
  }
});



//pasarme el CURL que le pega a este endpoint

app.post("/jugadores", async (req, res) => {
  try {
    const { nombre, apellido, fecha_nacimiento, clubId, dni } = req.body;

    if (!nombre || !apellido || !fecha_nacimiento || !clubId) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const club = await traerClubPorId(clubId);

    if (!club) {
      return res.status(404).json({ error: "El club solicitado no existe" });
    }

    const nuevoJugador = await crearJugador({
      nombre,
      apellido,
      fechaNacimiento: fecha_nacimiento,
      clubId,
      dni
    });

    return res.status(201).json(nuevoJugador);
  } catch (error) {
    console.error("Error en POST /jugadores:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


app.put("/jugadores/:id", async (req, res) => {
//se le pasa el id del jugador en la url
//con ese id primero:
//buscamos el jugador en el repo, en caso de no existir, devolver mensaje de error con status 404
//en el body van a viajar los campos a actualizar
//vas a crer para actualizar una funcion en el repositorio que va a recibir dos paramatros:
//1: el id del jugador
//2: los campos a actualizar
//la funcion en caso de funciuonar va a devolver un mensaje de exito con status 200 y va a devolver el jugador actualizado
  try {
    const jugadorId = req.params.id;
    const camposActualizar = req.body;

    // Buscamos todos los jugadores para validar si existe
    const jugadores = await traerJugadores();
    const jugador = jugadores.find(j => j.id == jugadorId);

    // Si no existe, devolvemos 404
    if (!jugador) {
      return res.status(404).json({ error: "El jugador no existe" });
    }

    // Si existe, actualizamos con los campos recibidos
    const jugadorActualizado = await actualizarJugador(jugadorId, camposActualizar);

    // Devolvemos el jugador actualizado
    return res.status(200).json({
      mensaje: "Jugador actualizado con éxito",
      jugador: jugadorActualizado
    });

  } catch (error) {
    console.error("Error en PUT /jugadores:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});



// Inicia el servidor y lo pone a escuchar en el puerto definido
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
