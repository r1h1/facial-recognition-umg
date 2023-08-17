//SE REALIZAN CONSTANTES PARA SU RESPECTIVA IMPORTACIÓN
const mysql = require('mysql');
const config = require('../config');

//CONSTANTE DE CONEXIÓN A BASE DE DATOS
const dbConfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
}

//STRING PARA CADENA DE CONEXIÓN
let stringConnection;


//FUNCIÓN PARA CONECTAR Y DETECTAR ERRORES DE CONEXIÓN
const mysqlConnection = () => {
    stringConnection = mysql.createConnection(dbConfig);

    stringConnection.connect((err) => {
        if (err) {
            console.log("Warning!: ", '[db err]', err);
            setTimeout(mysqlConnection, 200);
        }
        else {
            console.log("Welcome, Connect");
        }
    });

    stringConnection.on('Warning!: ', err => {
        console.log('[db err]', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            mysqlConnection();
        }
        else {
            throw err;
        }
    });
}


//ENCENDEMOS LA CONEXIÓN
mysqlConnection();


//PROTOCOLOS PARA MANEJO DE INFORMACIÓN
//DEVOLVER TODOS LOS DATOS
const data = (table) => {
    return new Promise((resolve, reject) => {
        stringConnection.query(`SELECT DISTINCT * FROM ${table} ORDER BY id ASC`, (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}


//DEVOLVER UN SOLO DATO POR ID
const oneData = (table, id) => {
    return new Promise((resolve, reject) => {
        stringConnection.query(`SELECT DISTINCT * FROM ${table} WHERE id=${id}`, (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}


//DEVOLVER DATOS DE MODULOS POR ROL ID
const rolData = (table, idrol) => {
    return new Promise((resolve, reject) => {
        stringConnection.query(`SELECT * FROM ${table} WHERE idrol=${idrol}`, (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}


//INSERTAR UN REGISTRO DE LA BASE DE DATOS
const addData = (table, data) => {
    return new Promise((resolve, reject) => {
        stringConnection.query(`INSERT INTO ${table} SET ? ON DUPLICATE KEY UPDATE ?`, [data, data], (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}

//BORRAR UN REGISTRO DE LA BASE DE DATOS
const deleteData = (table, data) => {
    return new Promise((resolve, reject) => {
        stringConnection.query(`DELETE FROM ${table} WHERE id=?`, data.id, (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}

//CONSULTAR POR QUERY
const query = (table, query) => {
    return new Promise((resolve, reject) => {
        stringConnection.query(`SELECT * FROM ${table} WHERE ?`, query, (error, result) => {
            return error ? reject(error) : resolve(result[0]);
        });
    });
}

//SE EXPORTAN LOS PROTOCOLOS PARA MANEJO DE INFO
module.exports = {
    data,
    oneData,
    addData,
    deleteData,
    query,
    rolData
}