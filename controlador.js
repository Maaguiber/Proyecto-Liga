const jugadoresRepository = require("./repositorio");

// Función para traer todos los jugadores (GET /jugadores)
async function getJugadores(req, res) {
  try {
    const { clubID } = req.query;
    let jugadores = await jugadoresRepository.traerJugadores();

    if (clubID && isNaN(Number(clubID))) {
      return res.status(400).json({ error: "El clubID debe ser un número" });
    }

    if (clubID) {
      jugadores = jugadores.filter(j => j.club_id == Number(clubID));
    }

    return res.json(jugadores);
  } catch (error) {
    console.error("Error en GET /jugadores:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

// Función para traer un jugador por ID (GET /jugadores/:id)
async function getJugadorPorId(req, res) {
  try {
    const id = req.params.id;
    if (isNaN(Number(id))) {
      return res.status(400).json({ error: "El ID debe ser un número" });
    }

    const jugadores = await jugadoresRepository.traerJugadores();
    const jugador = jugadores.find(j => j.id == id);

    if (!jugador) {
      return res.status(404).json({ error: "Jugador no encontrado" });
    }

    return res.json(jugador);
  } catch (error) {
    console.error("Error en GET /jugadores/:id:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

// Función para crear un jugador (POST /jugadores)
async function crearJugador(req, res) {
  try {
    const { nombre, apellido, fecha_nacimiento, clubId, dni } = req.body;

    if (!nombre || !apellido || !fecha_nacimiento || !clubId) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const club = await jugadoresRepository.traerClubPorId(clubId);
    if (!club) {
      return res.status(404).json({ error: "El club no existe" });
    }

    const nuevoJugador = await jugadoresRepository.crearJugador({
      nombre,
      apellido,
      fechaNacimiento: fecha_nacimiento,
      clubId,
      dni
    });

    return res.status(201).json(nuevoJugador);
  } catch (error) {
    console.error("Error en POST /jugadores:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

// Función para actualizar un jugador (PUT /jugadores/:id)
async function actualizarJugador(req, res) {
  try {
    const id = req.params.id;
    const camposActualizar = req.body;

    const jugadores = await jugadoresRepository.traerJugadores();
    const existe = jugadores.find(j => j.id == id);

    if (!existe) {
      return res.status(404).json({ error: "El jugador no existe" });
    }

    const jugadorActualizado = await jugadoresRepository.actualizarJugador(id, camposActualizar);

    return res.status(200).json({
      mensaje: "Jugador actualizado con éxito",
      jugador: jugadorActualizado
    });
  } catch (error) {
    console.error("Error en PUT /jugadores:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

// Exportamos todas las funciones dentro de un objeto
const jugadoresController = {
  getJugadores,
  getJugadorPorId,
  crearJugador,
  actualizarJugador
};

module.exports = jugadoresController;


