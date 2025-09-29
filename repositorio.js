const prompt = require('prompt-sync')();
const mysql = require('mysql2/promise'); // usamos la versión con promesas porque nos permite trabajar con async/await.

async function main() {
    while (true) {
        let nombre = prompt('Ingrese un nombre (o "Salir" para terminar): ').trim();
        if (nombre.toLowerCase() === 'salir') break;

        let apellido = prompt('Ingrese un apellido (o "Salir" para terminar): ').trim();
        if (apellido.toLowerCase() === 'salir') break;

        if (!nombre || !apellido) {
            console.log('El nombre o el apellido están vacíos');
            continue;
        }

        let fechaNacimiento = prompt('Ingrese fecha de nacimiento (YYYY-MM-DD), por ejemplo 1990-05-15: ').trim();
        if (!fechaNacimiento) {
            console.log('Fecha de nacimiento inválida');
            continue;
        }

        let clubId = Number(prompt('Ingrese ID del club: ').trim());
        if (isNaN(clubId) || clubId <= 0) {
            console.log('Club ID inválido');
            continue;
        }

        await crearJugador(nombre, apellido, fechaNacimiento, clubId);
        await mostrarNombres();

        console.log('-----------------------------------');
    }

    console.log('Programa terminado.');
}

main();

async function crearJugador(nombre, apellido, fechaNacimiento, clubId) {
    // await detiene la ejecución hasta que MySQL termine la inserción.
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'passucci',
        database: 'holamundo',
        port: 3306
    });
// Punto clave: async/await nos permite tratar consultas que toman tiempo como si fueran operaciones 
// síncronas, evitando problemas de “conexión cerrada” o de resultados incompletos.
     try {//intenta ejecutar la consulta a MySQL.
        const [result] = await connection.execute(
            'INSERT INTO jugadores (nombre, apellido, fecha_nacimiento, club_id) VALUES (?, ?, ?, ?)',
            [nombre, apellido, fechaNacimiento, clubId]
        );
        console.log('Jugador creado con ID:', result.insertId);
    } catch (err) {
        console.log('No se pudo crear el jugador:', err.message);
    } finally {
        await connection.end();
    }
}

async function mostrarNombres() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'passucci',
        database: 'holamundo',
        port: 3306
    });

    try {
        const [results] = await connection.execute('SELECT nombre FROM jugadores');
        console.log('\n--- Nombres de los jugadores ---');
        results.forEach((j, i) => console.log(`${i + 1}. ${j.nombre}`));
        console.log('-------------------------------\n');
    } catch (err) {
        console.log('Error al obtener los nombres:', err.message);
    } finally {
        await connection.end();
    }
}




