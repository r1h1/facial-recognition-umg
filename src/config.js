//SE EXPORTA EL PUERTO Y LOS DATOS DE CONEXIÓN
module.exports = {
    app: {
        port: process.env.port || 3001,
    },
    jwt: {
        secret: process.env.jet_secret || '7l;=e?H~*K(^XiR',
    },
    mysql: {
        host: process.env.mysql_host || 'localhost',
        user: process.env.mysql_user || 'root',
        password: process.env.mysql_password || '',
        database: process.env.mysql_db || 'bakerygo',
    }
}