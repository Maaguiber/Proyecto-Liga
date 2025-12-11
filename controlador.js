const { traerJugadores, crearJugador, actualizarJugador,traerJugadorPorId,traerJugadorPorDni  } = require("./repositorio");

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
     // verifica si existe jugador con ese dni (verificador unico);
    if (dni) {
      const jugadorExistente = await traerJugadorPorDni(dni);
      if (jugadorExistente) {
        return res.status(400).json({ 
          error: "Ya existe un jugador con ese DNI" 
        });
      }
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
    // error.code es una propiedad del objeto error que devuelve MySQL cuando falla una consulta SQL
    // Lo usamos para dar mensajes de error más claros al usuario, en vez del genérico "Error interno del servidor"
    console.error("Error en POST /jugadores:", error);
    let mensajeError = "Error interno del servidor";
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      mensajeError = "El club especificado no existe";
    } else if (error.code === 'ER_DUP_ENTRY') {
      mensajeError = "Ya existe un jugador con esos datos (posible DNI duplicado)";
    } else if (error.sqlMessage) {
      mensajeError = `Error en la base de datos: ${error.sqlMessage}`;
    }
    return res.status(500).json({ 
      error: mensajeError
    });
  }
} 


// putJugadoresController se traían todos los jugadores de la base solo para buscar uno
async function putJugadoresController(req, res) {
  try {
    const jugadorId = req.params.id;
    const camposActualizar = req.body;
    // Ahora trae solo el jugador necesario por ID
    const jugador = await traerJugadorPorId(jugadorId); 
    if (!jugador) {
      return res.status(404).json({ error: "El jugador no existe" });
    }
    const jugadorActualizado = await actualizarJugador(jugadorId, camposActualizar);
    return res.status(200).json({
      mensaje: "Jugador actualizado con éxito",
      jugador: jugadorActualizado
    });
  } catch (error) {
    //respuesta mas clara de la consigna 2 
    console.error("Error en PUT /jugadores:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}


module.exports = { getJugadoresController, postJugadoresController, putJugadoresController };