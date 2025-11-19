const express = require("express");
const { traerJugadores, crearJugador, traerClubPorId, actualizarJugador } = require("./repositorio");
const { crearJugadorFuncion } = require("./controlador");
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
    //el dni es unico, no se tiene que repetir, para esto hay que hacer dos cosas
    // 1-  agregar constraint UNIQUE al campo dni https://www.w3schools.com/mysql/mysql_unique.asp
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

app.put("/jugadores/:id", crearJugadorFuncion);



// Inicia el servidor y lo pone a escuchar en el puerto definido
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
