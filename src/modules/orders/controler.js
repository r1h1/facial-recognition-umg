const dataTable = 'orders';

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

    const dataWithDates = (createdDate, finishDate) => {
        return db.dataWithDates(dataTable, createdDate, finishDate);
    }

    const dataWithDatesAndClients = (createdDate, finishDate) => {
        return db.dataWithDatesAndClients(dataTable, createdDate, finishDate);
    }

    const dataWithIdClientAndOrderNumberFilter = (idclient, ordernumber) => {
        return db.dataWithIdClientAndOrderNumberFilter(dataTable, idclient, ordernumber);
    }

    const dataWithIdClientFilter = (idclient) => {
        return db.dataWithIdClientFilter(dataTable, idclient);
    }

    const dataWithDatesAndProducts = (createdDate, finishDate) => {
        return db.dataWithDatesAndProducts(dataTable, createdDate, finishDate);
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
        dataWithDates,
        dataWithDatesAndClients,
        dataWithDatesAndProducts,
        dataWithIdClientAndOrderNumberFilter,
        dataWithIdClientFilter
    }
}