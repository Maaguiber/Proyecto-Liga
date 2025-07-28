const prompt = require('prompt-sync')();

function pedirValorString(mensajeAMostrar) {
    var valor = prompt(mensajeAMostrar);
    return valor;
}

function noEsUnNumero(numero) {
    const resultado = isNaN(numero)
    return resultado
}


function pedirValorNumber(mensajeAMostrar) {
    var valor = prompt(mensajeAMostrar);
    if((valor < 0)){
        console.log("error de edad")
       return  pedirValorNumber(mensajeAMostrar)
    }
    var valorComoNumber = Number(valor);
    return valorComoNumber;
}

function pedirValorBoolean(mensajeAMostrar) {
    return !!mensajeAMostrar;
}

module.exports = {
    pedirValorString,
    pedirValorNumber,
    pedirValorBoolean,
    noEsUnNumero
}