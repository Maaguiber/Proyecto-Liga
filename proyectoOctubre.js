var usuariosEnLaBase = [
    { id: 1, nombre: "Alejo", apellido: "Ortega", edad: 28, apodo: "Animal" },
    { id: 2, nombre: "Lucas", apellido: "Florena", edad: 29, apodo: "Oreja" },
    { id: 3, nombre: "Emiliano", apellido: "Cancinos", edad: 28, signo: "Canci" },
]

function main() {

    var express = require('express')
    const app = express();

    app.use(express.json()); // middelware que manejar solicitudes con cuerpo JSON
    app.use(express.urlencoded({ extended: true })); // Para manejar solicitudes con datos de formularios

    app.post("/usuarios/crear", nuevoUsuario);
    app.get("/usuarios", buscarID);

    app.listen(3003, escuchando)

    function escuchando() {
        console.log("servidor a la espera de conexiones")
    }

}
main();

function nuevoUsuario(req, res) {
    // var nuevoUsuario = req.body
    for (var i = 0; i < usuariosEnLaBase.length; i++) {
        var nuevoUsuario = req.body
        if (nuevoUsuario.id === usuariosEnLaBase[i].id) {
            res.status(400).send("el Id ya existe en labase de datos");
        }
    }
    usuariosEnLaBase.push(nuevoUsuario)
    res.status(200).send({ "Usuario creado correctamente": usuariosEnLaBase });
}

function buscarID(req, res) {
    var queryString = req.query
    var i = 0;
    // buscar un elemento dentro de un array que cumpla con una condición
    for (i; i < usuariosEnLaBase.length; i++) {
        if (usuariosEnLaBase[i].id == queryString.id) {
            res.send({ "el usuario es ": usuariosEnLaBase[i].nombre });
            return
        }
    }
}

