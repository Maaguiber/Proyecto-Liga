
// - GET /jugador
// - Va a esperar query-parameters (?ejemploDeQueryParam=valor)
// - Los query-params que puede recibir son: ?apellido=<valor> o ?club=<valor>
// - Solo puede recibir un query-param por ahora, si el cliente (el que llama al endpoint)
//  manda los dos, devolvemos un Status Code = 400 (que es BadRequest, request incorrecto digamos)
// - La idea es que si recibis ?apellido=unapellido busques todos los jugadores que tengan como apellido unapellido
// - Lo mismo para ?club=boca, todos los jugadores que jueguen en boca y así para cualquier cosa que te manden
// - En caso de que no encuentres ningun jugador para el query-param que te mandaron, tenemos que devolver Status Code = 404 (Not Found, o no encontrado)

// Tip, para hacer comparación de strings si hacemos Ortega === ortega, da negativo, por la O mayuscula, por ende, 
// siempre antes de comparar vas a tener que hacer jugador.apellido.toLowerCase() que es una función que tienen todas
//  las variables de tipo string para pasar su valor a minúsculas, de esa forma vas a poder comprar sin preocuparte por las mayusculas

const guardadorDeArchivos = require('./guardador-de-archivos')
const leerCsv = require('./csv-reader')

function main() {

    var express = require('express')
    const app = express();

    app.use(express.json()); // middelware que manejar solicitudes con cuerpo JSON
    app.use(express.urlencoded({ extended: true })); // Para manejar solicitudes con datos de formularios

    app.get('/procesarJugadores', procesarJugadores)
    //app.get('/jugador', buscadorDeJugadores)
     app.listen(3003, escuchando)

    function escuchando() {
        console.log("servidor a la espera de conexiones")
    }
}

main();

async function procesarJugadores(req, res) {
    const resultado = await leerCsv('./dataJugadores.csv')
    console.log(resultado)
    for (var i = 0; i < resultado.length; i++) {
        var nombreJugador = resultado[i].name;
        var apellidoJugador = resultado[i].lastname;
        var clubJugador = resultado[i].club;
        var tipoDeArchivo = '.txt';
        guardadorDeArchivos.guardarArchivo(nombreJugador + apellidoJugador + tipoDeArchivo, '\n' + nombreJugador + '\n' + apellidoJugador + '\n' + clubJugador);
    }
    return res.status(201).send('Jugadores Creados')
}

async function buscadorDeJugadores(request, response) {

    var parametroQuery = request.query
    var cantidadDePropiedadesQuery = Object.keys(parametroQuery).length;
    if (cantidadDePropiedadesQuery != 1) {
        return response.status(400).send("un solo parametro");
    }
    if (!!parametroQuery.club == true && !!parametroQuery.apellido == false) {
        var clubQueEstoyBuscando = parametroQuery.club.toLowerCase()
        var dataDeLosJugadores = await leerCsv('./dataJugadores.csv')
        for (var i = 0; i < dataDeLosJugadores.length; i++) {
            var dataJugadoresCsvMinuscula = dataDeLosJugadores[i].club.toLowerCase()
            dataDeLosJugadores[i].club = dataJugadoresCsvMinuscula
        }
        var clubEncontrado = [];
        for (var i = 0; i < dataDeLosJugadores.length; i++) {  // i = indice
            var jugador = dataDeLosJugadores[i] // jugador va cambiando con cada iteracion
            if (jugador.club == clubQueEstoyBuscando) {
                clubEncontrado.push(jugador)
            }
        }
        if (clubEncontrado.length > 0) {
            response.status(200).send(clubEncontrado)
        } else {
            response.status(404).send("este jugador no cumple las condiciones")
        }
    }

    if (!!parametroQuery.club == false && !!parametroQuery.apellido == true) {
        var apellidoQueEstoyBuscando = parametroQuery.apellido.toLowerCase()
        var infoJugadores = await leerCsv('./dataJugadores.csv')
        for (var i = 0; i < infoJugadores.length; i++) {
            var infoJugadoresMinuscula = infoJugadores[i].lastname.toLowerCase()
            infoJugadores[i].lastname = infoJugadoresMinuscula
        }
        var apellidoEncontrado = [];
        for (var i = 0; i < infoJugadores.length; i++) {  // i = indice
            var jugador = infoJugadores[i] // jugador va cambiando con cada iteracion
            if (jugador.lastname == apellidoQueEstoyBuscando) {
                apellidoEncontrado.push(jugador)
            }
        }
        if (apellidoEncontrado.length > 0) {
            response.status(200).send(apellidoEncontrado)
        } else {
            response.status(404).send("este jugador no cumple las condiciones")
        }
    }
}



function leerArchivador(req, res) {
    guardadorDeArchivos.leedorDeArchivo('nuevoArchivoData.txt')
    return res.status(200).send("archivo Leido ")
}

