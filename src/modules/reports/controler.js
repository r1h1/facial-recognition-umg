const dataTable = 'orders';

module.exports = function (dbInjected) {

    let db = dbInjected;

    if(!db){
        db = require("../../db/mysql");
    }
    
    const dataWithDates = (createdDate, finishDate) => {
        return db.dataWithDates(dataTable, createdDate, finishDate);
    }

    return {
        dataWithDates
    }
}