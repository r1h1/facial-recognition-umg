const dataTable = 'products';

module.exports = function (dbInjected) {

    let db = dbInjected;

    if(!db){
        db = require("../../db/mysql");
    }

    const data = (table) => {
        return db.data(dataTable)
    }

    const oneData = (id) => {
        return db.oneData(dataTable, id);
    }

    const dataProductWithName = (name) => {
        return db.dataProductWithName(dataTable, name);
    }

    const addData = (body) => {
        return db.addData(dataTable, body);
    }

    const deleteData = (body) => {
        return db.deleteData(dataTable, body);
    }

    return {
        data,
        oneData,
        deleteData,
        addData,
        dataProductWithName
    }
}