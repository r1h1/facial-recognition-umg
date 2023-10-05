//MANEJO DE ERRORES
const error = (message, code) => {
    let e = new Error(message, code);
    if(code){
        e.statusCode = code;
    }
    return e;
}

module.exports = error;