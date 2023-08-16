//ERRORES MANEJADOS DE RED
const response = require('./responses');

const errors = (err, req, res, next) => {
    console.error('[error]', err);

    const message = err.message || 'Error de Servidor';
    const status = err.status || 500;

    response.error(req, res, message, status);
}

module.exports = errors;