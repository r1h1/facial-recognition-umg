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


//DEVOLVER TODOS LOS DATOS POR ID DE RESIDENTE
const dataFilterWithResidentId = (table, id) => {
    return new Promise((resolve, reject) => {
        stringConnection.query(`SELECT DISTINCT * FROM ${table} WHERE usergeneratedinvitation=${id} ORDER BY id ASC`, (error, result) => {
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


//DEVOLVER DATOS DEL VISITANTE POR ACCESO
const visitorData = (table, accesscode) => {
    return new Promise((resolve, reject) => {
        stringConnection.query(`SELECT * FROM ${table} WHERE accesscode='${accesscode}'`, (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}


//DEVOLVER DATOS DEL VISITANTE POR FECHAS
const reportVisitorEntrysDates = (table, dateandhourentry, dateandhourexit) => {
    return new Promise((resolve, reject) => {
        stringConnection.query(`SELECT DISTINCT ${table}.id, ${table}.iduserentryandexit, ${table}.dateandhourentry, 
        ${table}.dateandhourexit, ${table}.typeuser, vt.fullname,vt.addresstovisit,vt.cui,
        vt.typeofvisit,vt.housenumber 
        FROM entrys_and_exits 
        INNER JOIN visitors vt ON ${table}.iduserentryandexit = vt.id 
        WHERE ${table}.dateandhourentry >= '${dateandhourentry}' AND ${table}.dateandhourentry <= '${dateandhourexit}' AND ${table}.typeuser = 0;`, (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}


//DEVOLVER DATOS DEL RESIDENTE POR FECHAS
const reportResidentEntrysDates = (table, dateandhourentry, dateandhourexit) => {
    return new Promise((resolve, reject) => {
        stringConnection.query(`SELECT DISTINCT ${table}.id, ${table}.iduserentryandexit, ${table}.dateandhourentry, 
        ${table}.dateandhourexit, ${table}.typeuser, us.fullname,us.address,us.housenumber
        FROM entrys_and_exits 
        INNER JOIN users us ON ${table}.iduserentryandexit = us.id 
        WHERE ${table}.dateandhourentry >= '${dateandhourentry}' AND ${table}.dateandhourentry <= '${dateandhourexit}' AND ${table}.typeuser = 1;`, (error, result) => {
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
    reportVisitorEntrysDates,
    reportResidentEntrysDates,
    addData,
    deleteData,
    query,
    rolData,
    visitorData,
    dataFilterWithResidentId
}