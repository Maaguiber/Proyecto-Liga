const jugadoresRepository = require("./repositorio");

async function getJugadores(req, res) {
  try {
    // si falla pasamos al catch
    const { clubID } = req.query; // ID del club desde la query
    let jugadores = await jugadoresRepository.traerJugadores(); // Trae todos
    // El primer if valida que el clubID sea un número válido
    if (clubID && isNaN(Number(clubID))) {
      return res.status(400).json({ error: "El clubID debe ser un número" });
    }
    // Este segundo if recién filtra cuando el valor ya es seguro y válido
    if (clubID) {
      jugadores = jugadores.filter(j => j.club_id == Number(clubID)); // Filtra por club
    }
    return res.json(jugadores);
  } catch (error) {
    // si hay error responde estado 500 
    console.error("Error en GET /jugadores:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
 
async function getJugadorPorId(req, res) {
  try {
    const id = req.params.id; // ID desde la URL
    if (isNaN(Number(id))) {
          // Si alguien pone /jugadores/abc - no es número - devolves 400 Bad Request
      return res.status(400).json({ error: "El ID debe ser un número" });
    }

    const jugadores = await jugadoresRepository.traerJugadores(); // Carga todos
    const jugador = jugadores.find(j => j.id == id);find() //recorre el array y devuelve el primer jugador cuyo id coincide

    if (!jugador) {
      return res.status(404).json({ error: "Jugador no encontrado" });
    }

    return res.json(jugador); 
  } catch (error) {
    // Si ocurre un error, lo capturamos y respondemos con un estado 500
    console.error("Error en GET /jugadores/:id:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function crearJugador(req, res) {
  try {
    const { nombre, apellido, fecha_nacimiento, clubId, dni } = req.body; // El cliente envía un y sacamos las propiedades necesarias
    if (!nombre || !apellido || !fecha_nacimiento || !clubId) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }//Si falta alguno responde 400 Bad Request - No es obligatorio el DNI

    const club = await jugadoresRepository.traerClubPorId(clubId); // Busca ese club en la base 
    if (!club) {
      return res.status(404).json({ error: "El club no existe" });
    }
    const nuevoJugador = await jugadoresRepository.crearJugador({
      nombre,
      apellido,
      fechaNacimiento: fecha_nacimiento,
      // en el repo la propiedad se llama fechaNacimiento
      clubId,
      dni
    }); // Crea jugador
    return res.status(201).json(nuevoJugador); // Devuelve creado
  } catch (error) {
    // Si ocurre un error, lo capturamos y respondemos con un estado 500
    console.error("Error en POST /jugadores:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function actualizarJugador(req, res) {
  try {
    // si algo falla pasamos al catch
    const id = req.params.id; // ID a actualizar desde la URL
    const camposActualizar = req.body; // Datos para actualizar

    const jugadores = await jugadoresRepository.traerJugadores(); // revisa si el jugador existe
    const existe = jugadores.find(j => j.id == id); // Verifica existencia
    if (!existe) {
      return res.status(404).json({ error: "El jugador no existe" });
    }
    const jugadorActualizado = await jugadoresRepository.actualizarJugador(id, camposActualizar); // Actualiza

    return res.status(200).json({
      mensaje: "Jugador actualizado con éxito",
      jugador: jugadorActualizado
    });
  } catch (error) {
    // Si ocurre un error, lo capturamos y respondemos con un estado 500
    console.error("Error en PUT /jugadores:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

const jugadoresController = {
  getJugadores,
  getJugadorPorId,
  crearJugador,
  actualizarJugador
};

module.exports = jugadoresController;


