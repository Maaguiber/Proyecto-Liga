const connection = require("./database");

// Función que devuelve todos los jugadores
async function traerJugadores() {
  try {
    const result = await connection.query("SELECT * FROM jugadores");
    return result[0]; // result[0] = filas de la tabla
  } catch (err) {
    console.error("Error al traer jugadores:", err);
    throw err;
  }
}

async function traerClubPorId(id) {
  try {
    // Ejecutar la consulta para buscar el club por su ID
    const resultado = await connection.execute(
      "SELECT * FROM clubes WHERE id = ?",
      [id]
    );

    // resultado[0] son las filas que devuelve la consulta
    const filas = resultado[0];

    // Verificar si se encontró algún club
    if (filas.length > 0) {
      // Retornar el primer club encontrado
      return filas[0];
    } else {
      // Si no se encontró, retornar null
      return null;
    }

  } catch (error) {
    // Mostrar error en consola y volver a lanzar la excepción
    console.error("Error al traer club:", error);
    throw error;
  }
}

async function actualizarJugador(id, camposActualizar) {
  try {
    // Verificar que se envíen campos para actualizar
    const claves = Object.keys(camposActualizar);
    if (claves.length === 0) {
      throw new Error("No se proporcionaron campos para actualizar");
    }

    // Construir arrays separados para la query
    const campos = [];
    const valores = [];

    for (let i = 0; i < claves.length; i++) {
      const campo = claves[i];
      const valor = camposActualizar[campo];

      // Agregar a la lista de campos y valores
      campos.push(`${campo} = ?`);
      valores.push(valor);
    }

    // Agregar el id al final para la cláusula WHERE
    valores.push(id);

    // Crear la sentencia SQL final
    const sql = `UPDATE jugadores SET ${campos.join(", ")} WHERE id = ?`;

    // Ejecutar la query
    const [result] = await connection.execute(sql, valores);

    // Verificar si se actualizó algún registro
    if (result.affectedRows === 0) {
      return null; // jugador no encontrado
    }

    // Traer el jugador actualizado
    const [rows] = await connection.execute("SELECT * FROM jugadores WHERE id = ?", [id]);
    const jugadorActualizado = rows[0];

    return jugadorActualizado;

  } catch (error) {
    console.error("Error al actualizar jugador:", error);
    throw error;
  }
}

async function crearJugador(parametrosCrearJugador) {
  try {
    const { nombre, apellido, fechaNacimiento, clubId, dni } = parametrosCrearJugador;

    const [result] = await connection.execute(
      "INSERT INTO jugadores (nombre, apellido, fecha_nacimiento, club_id, dni) VALUES (?, ?, ?, ?, ?)",
      [nombre, apellido, fechaNacimiento, clubId, dni || null]
    );

    console.log("Jugador creado con ID:", result.insertId);
    return { id: result.insertId, nombre, apellido, fechaNacimiento, clubId, dni: dni || null };

  } catch (err) {
    console.log("No se pudo crear el jugador:", err.message);
  }
}


module.exports = { traerJugadores, crearJugador,traerClubPorId,actualizarJugador };
