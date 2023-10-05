const dataTable = 'visitors';

module.exports = function (dbInjected) {

    let db = dbInjected;

    if(!db){
        db = require("../../db/mysql");
    }

    const data = (table) => {
        return db.data(dataTable)
    }

    const dataFilterWithResidentId = (id) => {
        return db.dataFilterWithResidentId(dataTable, id)
    }

    const oneData = (id) => {
        return db.oneData(dataTable, id);
    }

    const visitorData = (accesscode) => {
        return db.visitorData(dataTable, accesscode);
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
        visitorData,
        dataFilterWithResidentId
    }
}