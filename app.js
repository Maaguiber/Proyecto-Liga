const express = require("express");
const { traerJugadores, crearJugador, traerClubPorId, actualizarJugador } = require("./repositorio");
const app = express();
const port = 3000;

app.use(express.json());

app.get("/jugadores", async (req, res) => {
  try {
    //parámetros enviados en la URL
    const { clubID } = req.query;
    // hace un SELECT * FROM jugadores en la base de datos
    let jugadores = await traerJugadores();
    if (clubID) {
      //.filter() recorre el array y devuelve un nuevo array con los jugadores que cumplan la condición jugador.club_id == clubID.
      jugadores = jugadores.filter(jugador => jugador.club_id == clubID);
    }
    res.json(jugadores);
  } catch (error) {
    console.error("Error al obtener jugadores:", error);
    // 500 Significa “Error interno del servidor”
    // errores inesperados que no son culpa del cliente
    res.status(500).json({ error: "Error al obtener jugadores" });
  }
});


app.post("/jugadores", async (req, res) => {
  try {
    const { nombre, apellido, fecha_nacimiento, clubId, dni } = req.body;
    //valida que esten los datos 
    if (!nombre || !apellido || !fecha_nacimiento || !clubId) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }
    //va a la Data Base y pregunta "hay un club con este ID?" SI = Club NO = Null
    // valida  el dato tenga sentido 
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
  try {
    const jugadorId = req.params.id;
    const camposActualizar = req.body;
    // Validamos que el jugador exista 
    const jugadores = await traerJugadores();
    //.find busca el primer elemento que cumpla una condición
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
    // 500 Significa “Error interno del servidor”
    // errores inesperados que no son culpa del cliente
    res.status(500).json({ error: "Error interno del servidor" });
  }
});



// Inicia el servidor y lo pone a escuchar en el puerto definido
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
