const dataTable = 'modules';

module.exports = function (dbInjected) {

    let db = dbInjected;

    if(!db){
        db = require("../../db/mysql");
    }

    const dataModules = (table) => {
        return db.dataModules(dataTable)
    }

    const oneData = (id) => {
        return db.oneData(dataTable, id);
    }

    const dataModulesWithIdRol = (id) => {
        return db.dataModulesWithIdRol(dataTable, id);
    }

    const addData = (body) => {
        return db.addData(dataTable, body);
    }

    const deleteData = (body) => {
        return db.deleteData(dataTable, body);
    }

    return {
        dataModules,
        oneData,
        deleteData,
        addData,
        dataModulesWithIdRol
    }
}