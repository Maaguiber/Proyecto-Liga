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

// Exportamos las funciones para usar en app.js
module.exports = { traerJugadores, crearJugador, mostrarNombres };
