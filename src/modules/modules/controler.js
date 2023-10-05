const dataTable = 'modules';

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

    const rolData = (idrol) => {
        return db.rolData(dataTable, idrol);
    }

    return {
        data,
        rolData,
        oneData
    }
}