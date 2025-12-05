const connection = require("./database");

async function traerJugadores() {
  try {
    const result = await connection.query("SELECT * FROM jugadores");
    return result[0];
  } catch (err) {
    console.error("Error al traer jugadores:", err);
    throw err;
  }
}

async function traerClubPorId(id) {
  try {
    const [rows] = await connection.execute(
      "SELECT * FROM clubes WHERE id = ?",
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Error al traer club:", error);
    throw error;
  }
}

async function actualizarJugador(id, camposActualizar) {
  try {
    const claves = Object.keys(camposActualizar);
    if (claves.length === 0) {
      throw new Error("No se proporcionaron campos para actualizar");
    }

    const campos = [];
    const valores = [];

    for (const campo of claves) {
      campos.push(`${campo} = ?`);
      valores.push(camposActualizar[campo]);
    }

    valores.push(id);

    const sql = `UPDATE jugadores SET ${campos.join(", ")} WHERE id = ?`;
    const [result] = await connection.execute(sql, valores);

    if (result.affectedRows === 0) return null;

    const [rows] = await connection.execute(
      "SELECT * FROM jugadores WHERE id = ?",
      [id]
    );
    return rows[0];
  } catch (error) {
    console.error("Error al actualizar jugador:", error);
    throw error;
  }
}

async function crearJugador(parametrosCrearJugador) {
  try {
    const { nombre, apellido, fechaNacimiento, clubId, dni } =
      parametrosCrearJugador;

    const [result] = await connection.execute(
      "INSERT INTO jugadores (nombre, apellido, fecha_nacimiento, club_id, dni) VALUES (?, ?, ?, ?, ?)",
      [nombre, apellido, fechaNacimiento, clubId, dni || null]
    );

    return {
      id: result.insertId,
      nombre,
      apellido,
      fechaNacimiento,
      clubId,
      dni: dni || null
    };
  } catch (err) {
    console.log("No se pudo crear el jugador:", err.message);
    throw err;
  }
}

const jugadoresRepository = {
  traerJugadores,
  crearJugador,
  traerClubPorId,
  actualizarJugador
};

module.exports = jugadoresRepository;



