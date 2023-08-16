const dataTable = 'product_extra_ingredients';

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

    const extraIngredientsQuery = (idproduct) => {
        return db.extraIngredientsQuery(dataTable, idproduct);
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
        extraIngredientsQuery
    }
}