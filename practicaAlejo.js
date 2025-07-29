const fs = require("fs");
// fs Modulo que permite interactuar con el sistema de archivos y directorios
const alUsuario = require("./libreria");
// es una abstraccion para para poder leer archivo .csv
const leerCsv = require("./csv-reader");

async function main() {
    while (true) {
        //  Ejecuta  el  código  hasta que se interrumpe manualmente con una instrucción break
        var primerBusqueda = alUsuario.pedirValorString(
            "Ingrese una opción: buscar o agregar (o 'salir' para terminar)"
        ).toLowerCase();
        if (primerBusqueda === "salir") {
            console.log("Saliendo del programa");
            break;
        }
        if (primerBusqueda !== "agregar" && primerBusqueda !== "buscar") {
            console.log("Valor erróneo. Intente de nuevo.");
            // el continue evita que el resto del código se ejecute si el valor ingresado es incorrecto
            continue;
        }
        if (primerBusqueda === "agregar") {
            var arrayConObjetosJugadores = jugadorDentroDeUnArray();
            console.log("Jugadores cargados:", arrayConObjetosJugadores);
            var nuevosJugadores = agregarDatosCsv("dataJugadores.csv", arrayConObjetosJugadores);
            console.log(nuevosJugadores);
        }
        if (primerBusqueda === "buscar") {
            var apellidoABuscar = alUsuario.pedirValorString(
                "Ingrese apellido a buscar "
            );
            var promesa = await buscadorDeApellidos(apellidoABuscar);
            console.log("Resultado búsqueda:", promesa);
        }
    }
}
main();

function jugadorDentroDeUnArray() {
    var arrayDeJugadores = [];
    // cambie el for por un while ya que no estaba usando ninguna condicion
    while (true) {
        var jugador = {};
        jugador.apellido = alUsuario.pedirValorString("Ingrese un apellido :");
        if (jugador.apellido.toLowerCase() === "salir") {
            return arrayDeJugadores;
        }
        jugador.nombre = alUsuario.pedirValorString("Ingrese un nombre :");
        if (jugador.nombre.toLowerCase() === "salir") {
            return arrayDeJugadores;
        }
        var apellido = jugador.apellido.trim();// Limpiar espacios antes de validar
        var nombre = jugador.nombre.trim();// Limpiar espacios antes de validar
        // Validación de campos vacíos
        if (apellido === "" && nombre === "") {
            console.log("El apellido y el nombre están vacíos");
            continue;
        }
        if (apellido === "") {
            console.log("El apellido está vacío");
            continue;
        }
        if (nombre === "") {
            console.log("El nombre está vacío");
            continue;
        }
        jugador.edad = alUsuario.pedirValorNumber("Ingrese una edad:");
        if (alUsuario.noEsUnNumero(jugador.edad)) {
            console.log("Edad inválida");
            continue;
        }
        arrayDeJugadores.push(jugador);
        console.log("Jugador agregado correctamente");
    }
}
function agregarDatosCsv(rutaArchivo, datos, separador = ",") {
    //  Recibe un array de objetos (con apellido, nombre, edad).
    // Los convierte en líneas CSV.
    // los agrega a dataJugadores.csv 
    const columnas = ["apellido", "nombre", "edad"];
    const filasNuevas = datos.map((obj) =>
        columnas
            .map((col) =>
                obj[col] !== undefined && obj[col] !== null ? String(obj[col]) : ""
            )
            .join(separador)
    );
    let contenidoActual = "";
    if (fs.existsSync(rutaArchivo)) {
        contenidoActual = fs.readFileSync(rutaArchivo, "utf8");
    }
    const filasParaAgregar = filasNuevas.filter(
        (fila) => !contenidoActual.includes(fila)
    );
    const contenidoParaAgregar = "\n" + filasParaAgregar.join("\n");
    fs.appendFileSync(rutaArchivo, contenidoParaAgregar, "utf8");
    return contenidoParaAgregar;
}

async function buscadorDeApellidos(apellidoABuscar) {
    var apellidoQueEstoyBuscandoEnMinuscula = apellidoABuscar.toLowerCase();
    var infoJugadores = await leerCsv("./dataJugadores.csv");
    var apellidoEncontrado = [];
    for (var i = 0; i < infoJugadores.length; i++) {
        var jugador = infoJugadores[i];
        if (jugador.apellido.toLowerCase() === apellidoQueEstoyBuscandoEnMinuscula) {
            apellidoEncontrado.push(jugador);
        }
    }
    if (apellidoEncontrado.length === 0) {
        console.log("No se encontraron jugadores con ese apellido.");
    }
    return apellidoEncontrado;
}




