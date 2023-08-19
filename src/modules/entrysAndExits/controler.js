const dataTable = 'entrys_and_exits';

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

    const reportVisitorEntrysDates = (dateandhourentry, dateandhourexit) => {
        return db.reportVisitorEntrysDates(dataTable, dateandhourentry, dateandhourexit);
    }

    const reportResidentEntrysDates = (dateandhourentry, dateandhourexit) => {
        return db.reportResidentEntrysDates(dataTable, dateandhourentry, dateandhourexit);
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
        reportVisitorEntrysDates,
        reportResidentEntrysDates,
        deleteData,
        addData
    }
}