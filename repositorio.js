const prompt = require("prompt-sync")();
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




// Función para crear un jugador
async function crearJugador(parametrosCrearJugador) {
  try {
    //desestructurar un objeto
    const { nombre, apellido, fechaNacimiento, clubId } =
      parametrosCrearJugador;
    const [result] = await connection.execute(
      "INSERT INTO jugadores (nombre, apellido, fecha_nacimiento, club_id) VALUES (?, ?, ?, ?)",
      [nombre, apellido, fechaNacimiento, clubId]
    );
    console.log("Jugador creado con ID:", result.insertId);
  } catch (err) {
    console.log("No se pudo crear el jugador:", err.message);
  }
}

// Función para mostrar nombres en consola
async function mostrarNombres() {
  try {
    const [results] = await connection.execute("SELECT nombre FROM jugadores");
    console.log("\n--- Nombres de los jugadores ---");
    results.forEach((j, i) => console.log(`${i + 1}. ${j.nombre}`));
    console.log("-------------------------------\n");
    //retornar siempre el resultado de la consulta
    return results;
  } catch (err) {
    console.log("Error al obtener los nombres:", err.message);
  }
}

// Programa interactivo (solo si se ejecuta directamente)
async function main() {
  while (true) {
    let nombre = prompt('Ingrese un nombre (o "Salir" para terminar): ').trim();
    if (nombre.toLowerCase() === "salir") break;

    let apellido = prompt("Ingrese un apellido: ").trim();
    if (!apellido) continue;

    let fechaNacimiento = prompt(
      "Ingrese fecha de nacimiento (YYYY-MM-DD): "
    ).trim();
    let clubId = Number(prompt("Ingrese ID del club: ").trim());
    if (isNaN(clubId) || clubId <= 0) continue;

    await crearJugador(nombre, apellido, fechaNacimiento, clubId);
    await mostrarNombres();
  }

  console.log("Programa terminado.");
}

// Ejecuta main() solo si este archivo se corre directamente
if (require.main === module) {
  main();
}

module.exports = { traerJugadores, crearJugador, mostrarNombres,traerClubPorId,actualizarJugador };
