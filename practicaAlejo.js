// 1. Cuando comienza el programa, preguntarle al usuario si quiere agregar un jugador o buscar un jugador
// 2. Debería poder buscar los jugadores cargados en el CSV
// 3. Si elijo agregar un jugador, el jugador se debería agregar como una linea más del CSV sin afectar a los jugadores agregados antiguamente
// 4. Si elijo buscar un jugador deberia pedirle al usuario un apellido y buscar los jugadores que tengan ese apellido. Una vez que lo encuentra y lo imprime,
//  deberíamos volver al menú principal

// promesa = objeto que marca el final  de una funcion asincronica (async)
const fs = require("fs");
// fs Modulo que permite interactuar con el sistema de archivos y directorios
const alUsuario = require("./libreria");
const leerCsv = require("./csv-reader");

async function main() {
    //  Ejecuta  el  código  hasta que se interrumpe manualmente con una instrucción break
    while (true) {
        var primerBusqueda = alUsuario.pedirValorString(
            "Ingrese una opción: buscar o agregar (o 'salir' para terminar)"
        ).toLowerCase();
        if (primerBusqueda === "salir") {
            console.log("Saliendo del programa");
            break;
        }// Advierte el error y pide una nueva entrada
        if (primerBusqueda !== "agregar" && primerBusqueda !== "buscar") {
            console.log("Valor erróneo. Intente de nuevo.");
            continue;
        }
        if (primerBusqueda === "agregar") {
            var arrayConObjetosJugadores = jugadorDentroDeUnArray();
            console.log("Jugadores cargados:", arrayConObjetosJugadores);
            var nuevosJugadores = await agregarDatosCsv(
                "dataJugadores.csv",
                arrayConObjetosJugadores
            );
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

//despues de agregar o buscar un jugador, se debe preguntar si se quiere aagregar/buscar segun corresponda
//volver al menu principal, que deberia el mismo menu que al inicio del programa
//para agregar un jugador, se debe agregar si o si un apellido, un nombre y una edad, los 3 juntos o ninguno
//validar que esten los 3 antes de intentar crear el jugador
//logear en el mensaje de error los o el campo faltante

function jugadorDentroDeUnArray() {
    var arrayDeJugadores = [];
     // cambie el for por un while ya que no estaba usando ninguna condicion
    while (true){
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
    const columnas = ["apellido", "nombre", "edad"];
    // datos.map recorre cada objeto dentro del array datos.
    // columnas.map para cada objeto, toma solo los valores de "apellido", "nombre" y "edad"
    const filasNuevas = datos.map((obj) =>
        columnas
            .map((col) =>
                obj[col] !== undefined && obj[col] !== null ? String(obj[col]) : ""
            )
            .join(separador)
    );
    let contenidoActual = "";
    // Leer contenido actual si existe, si no cadena vacia
    if (fs.existsSync(rutaArchivo)) {
        contenidoActual = fs.readFileSync(rutaArchivo, "utf8");
    }
    // Filtrar filas nuevas para agregar solo las que no están en el archivo
    const filasParaAgregar = filasNuevas.filter(
        (fila) => !contenidoActual.includes(fila)
    );
    // Agrega un salto de línea al principio para que no se pegue al final del archivo.
    const contenidoParaAgregar = "\n" + filasParaAgregar.join("\n");
    // .appendFileSync añade datos al final de un archivo
    fs.appendFileSync(rutaArchivo, contenidoParaAgregar, "utf8");
    return contenidoParaAgregar;
}

async function buscadorDeApellidos(apellidoABuscar) {
    var apellidoQueEstoyBuscandoEnMinuscula = apellidoABuscar.toLowerCase();
    var infoJugadores = await leerCsv("./dataJugadores.csv");
    for (var i = 0; i < infoJugadores.length; i++) {
        var infoJugadoresMinuscula = infoJugadores[i].apellido.toLowerCase();
        infoJugadores[i].apellido = infoJugadoresMinuscula;
    }
    var apellidoEncontrado = [];
    for (var i = 0; i < infoJugadores.length; i++) {
        var jugador = infoJugadores[i]; // jugador va cambiando con cada iteracion
        if (jugador.apellido == apellidoQueEstoyBuscandoEnMinuscula) {
            apellidoEncontrado.push(jugador);
        }
    }
    if (apellidoEncontrado.length > 0) {
        for (var i = 0; i < apellidoEncontrado.length; i++) {
            "\n" + apellidoEncontrado[i].apellido + "\n";
        }
    } else {
        console.log("este jugador no cumple las condiciones");
    }
    return apellidoEncontrado;
}



