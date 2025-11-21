const { traerJugadores, crearJugador, traerClubPorId, actualizarJugador } = require("./repositorio");

async function getJugadoresController(req, res) {
  try {
    const { clubID } = req.query;
    // Trae todos los jugadores
    let jugadores = await traerJugadores();
    // Valida que clubID sea número si viene
    if (clubID && isNaN(Number(clubID))) {
      return res.status(400).json({
        error: "El parámetro clubID debe ser un número"
      });
    }
    // Filtra por club_id si viene clubID
    if (clubID) {
      const clubIDNumber = Number(clubID);
      // crea un nuevo array con solo los elementos que cumplen una condición.
      jugadores = jugadores.filter(j => j.club_id === clubIDNumber);
    }
    // Devuelve la lista (filtrada o completa)
    return res.json(jugadores);
  } catch (error) {
    // Error general del controlador
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function postJugadoresController(req, res) {
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
}



async function putJugadoresController(req, res) {
  try {
    const jugadorId = req.params.id;
    const camposActualizar = req.body;

    const jugadores = await traerJugadores();
    const jugador = jugadores.find(j => j.id == jugadorId);

    if (!jugador) {
      return res.status(404).json({ error: "El jugador no existe" });
    }

    const jugadorActualizado = await actualizarJugador(jugadorId, camposActualizar);

    return res.status(200).json({
      mensaje: "Jugador actualizado con éxito",
      jugador: jugadorActualizado
    });
  } catch (error) {
    console.error("Error en PUT /jugadores:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}


module.exports = { getJugadoresController, postJugadoresController, putJugadoresController };