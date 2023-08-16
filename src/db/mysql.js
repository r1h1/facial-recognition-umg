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


//DEVOLVER TODOS LOS MÓDULOS SIN DUPLICAR
const dataModules = (table) => {
    return new Promise((resolve, reject) => {
        stringConnection.query(`SELECT DISTINCT * FROM ${table} GROUP BY name ORDER BY id ASC`, (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}


//DEVOLVER UN SOLO PRODUCTO POR NOMBRE
const dataProductWithName = (table, name) => {
    return new Promise((resolve, reject) => {
        stringConnection.query(`SELECT * FROM ${table} WHERE name LIKE '%${name}%' ORDER BY name ASC`, (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}


//PROTOCOLOS PARA MANEJO DE INFORMACIÓN
//DEVOLVER TODOS LOS DATOS POR FECHAS
const dataWithDates = (table, createdDate, finishDate) => {
    return new Promise((resolve, reject) => {
        stringConnection.query(`SELECT DISTINCT * FROM ${table} WHERE createdDate >= '${createdDate}' AND finishDate <= '${finishDate}'`, (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}

//DEVOLVER TODOS LOS DATOS POR FECHAS Y CLIENTES
const dataWithDatesAndClients = (table, createdDate, finishDate) => {
    return new Promise((resolve, reject) => {
        stringConnection.query(`SELECT DISTINCT ${table}.id,${table}.ordernumber,${table}.status,${table}.totalpay,
        ${table}.idpayoption,${table}.idclient,
        ${table}.createdDate,${table}.finishDate,users.fullname
        FROM ${table} 
        INNER JOIN users ON ${table}.idclient = users.id
        WHERE createdDate >= '${createdDate}' AND finishDate <= '${finishDate}'`, (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}


//DEVOLVER TODOS LOS DATOS POR FECHAS Y PRODUCTOS
const dataWithDatesAndProducts = (table, createdDate, finishDate) => {
    return new Promise((resolve, reject) => {
        stringConnection.query(`SELECT DISTINCT ${table}.id,${table}.ordernumber,${table}.status,${table}.totalpay,
        ${table}.idpayoption,${table}.idclient,${table}.createdDate,${table}.finishDate,products.name
        FROM ${table} 
        INNER JOIN product_per_order ON ${table}.id = product_per_order.idorder
        INNER JOIN products ON product_per_order.idproduct = products.id
        WHERE createdDate >= '${createdDate}' AND finishDate <= '${finishDate}'`, (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}



//DEVOLVER TODAS LAS ÓRDENES QUE TENGA UN CLIENTE POR SU NUMERO DE ÓRDEN
const dataWithIdClientAndOrderNumberFilter = (table, idclient, ordernumber) => {
    return new Promise((resolve, reject) => {
        stringConnection.query(`SELECT * FROM ${table} WHERE idclient=${idclient} AND ordernumber='${ordernumber}'`, (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}



//DEVOLVER TODAS LAS ÓRDENES QUE TENGA UN CLIENTE
const dataWithIdClientFilter = (table, idclient) => {
    return new Promise((resolve, reject) => {
        stringConnection.query(`SELECT * FROM ${table} WHERE idclient=${idclient}`, (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}



//DEVOLVER TODOS LOS PRODUCTOS POR ORDENES
const dataWithProductsPerOrder = (table, idorder) => {
    return new Promise((resolve, reject) => {
        stringConnection.query(`SELECT product_per_order.id, product_per_order.idproduct,product_per_order.quantity,product_per_order.priceproduct,product_per_order.baseingredientsselected,product_per_order.idextraingredients,product_per_order.description, products.name FROM ${table} 
        INNER JOIN products ON products.id = product_per_order.idproduct
        WHERE product_per_order.idorder=${idorder}`, (error, result) => {
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


//DEVOLVER UN SOLO DATO POR ID ROL
const dataModulesWithIdRol = (table, id) => {
    return new Promise((resolve, reject) => {
        stringConnection.query(`SELECT DISTINCT * FROM ${table} WHERE idrol=${id}`, (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}


//DEVOLVER INGREDIENTES EXTRA POR ID PRODUCT
const extraIngredientsQuery = (table, id) => {
    return new Promise((resolve, reject) => {
        stringConnection.query(`SELECT DISTINCT * FROM ${table} WHERE idproduct=${id}`, (error, result) => {
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
    dataModules,
    oneData,
    dataWithDates,
    addData,
    deleteData,
    query,
    extraIngredientsQuery,
    dataWithDatesAndClients,
    dataWithDatesAndProducts,
    dataModulesWithIdRol,
    dataProductWithName,
    dataWithIdClientFilter,
    dataWithIdClientAndOrderNumberFilter,
    dataWithProductsPerOrder
}