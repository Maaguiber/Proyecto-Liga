const { traerJugadores, crearJugador, traerClubPorId, actualizarJugador } = require("./repositorio");

//mover el resto delas funciones de app.js par adejar prolijo el archivo
async function crearJugadorFuncion(req, res) {
  try {
    const { nombre, apellido, fecha_nacimiento, clubId, dni } = req.body;
    // Valida que estén los datos
    if (!nombre || !apellido || !fecha_nacimiento || !clubId) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }
    // Va a la Data Base y pregunta "hay un club con este ID?" SI = Club NO = Null
    // Valida que el dato tenga sentido
    const club = await traerClubPorId(clubId);
    if (!club) {
      return res.status(404).json({ error: "El club solicitado no existe" });
    }
    // El dni es único, no se tiene que repetir, para esto hay que hacer dos cosas
    // 1- agregar constraint UNIQUE al campo dni https://www.w3schools.com/mysql/mysql_unique.asp
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

module.exports = { crearJugadorFuncion };