const jRepository = require("./repositorio");

// Un Controller (controlador) es una función que maneja las peticiones HTTP entrantes. Se encarga de:
// Recibir la petición (req, res) desde Express
// Validar los datos recibidos
// Llamar a funciones del repositorio (que interactúan con la base de datos)
// Responder al cliente con el resultado apropiado

// En nuestro caso el controller actúan como una capa intermedia entre las rutas de Express y el repositorio.
// Es por eso que, (consigna: ) Controller no deberia ser parte del nombre de las funciones, 
// CONSIGNA
// 1 - los nombres de las funciones de un controlador deben representar lo que hacen, en este caso GET POST y PUT no me estan diciendo 
// lo que hace la funcion, por ejemplo get sirve tanto para traer un jugador como para traer varios.
// lo correcto es nombrarlas por lo que hacen : GET -> traer, encontrar. POST -> Crear, PUT -> actualizar

//  2 - no esta mal el enfoque de, a la hora de buscar un unico jugafdor por id, traer todos los jugadroes y hacer
// un .find() como haces en el putJugadoresController (a renombrar). Pero lo que en realidad deberia pasar es que en vez de un 
// unico endpoint tengas 2, traerJugadores(es un GET, trae TODOS los jugadores), traerJugadorPorId(es un GET tambien, pero trae un unico jugador filtrado por el id)
// crear ese endpoint que trae un unico jugador por id
// crear a ruta correspondiente para esa nueva funcion
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
    //CONSIGNA: que campos deberia tener camposActualizar? validar que los campos necesarios existan en en body
    const camposActualizar = req.body;

    // CONSIGA: reemplazar esta llamada por una que busque un jugador por id
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

// CONSIGNA: cambiar la forma de exportar en este archivo, en lugar de exportar las funciones individuales, exportá
// un objeto llamado jugadoresController que contenga todas las funciones
// como ayuda te puedo decir que el resultado final es que vos en app.js puedas pasar de esto:

// app.get("/jugadores", getJugadoresController); 
// const { getJugadoresController,postJugadoresController,putJugadoresController} = require("./controlador");

// a esto: 
// const jugadoresController = require("./controlador");
// app.get("/jugadores", jugadoresController.getJugadores);


module.exports = { getJugadoresController, postJugadoresController, putJugadoresController };