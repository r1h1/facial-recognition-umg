const dataTable = 'users';
const auth = require('../auth');

module.exports = function (dbInjected) {

    let db = dbInjected;

    if (!db) {
        db = require("../../db/mysql");
    }

    //VER TODOS LOS DATOS
    const data = (table) => {
        return db.data(dataTable)
    }

    //VER UN DATO
    const oneData = (id) => {
        return db.oneData(dataTable, id);
    }

    //AÑADIR DATOS
    const addData = async (body) => {
        const userObject = {
            id: body.id,
            fullname: body.fullname,
            address: body.address,
            phonenumber: body.phonenumber,
            email: body.email,
            nit: body.nit,
            idrol: body.idrol,
            status: body.status,
            gender: body.gender
        }

        const response = await db.addData(dataTable, userObject);
        var response2 = '';

        var insertId = 0;
        if (body.id == 0) {
            insertId = response.insertId;
        }
        else {
            insertId = body.id;
        }
        if (body.user || body.password) {
            response2 = await auth.addData({
                id: insertId,
                user: body.user,
                password: body.password
            });
        }

        return response2;
    }

    //BORRAR DATOS
    const deleteData = (body) => {
        return db.deleteData(dataTable, body);
    }

    return {
        data,
        oneData,
        deleteData,
        addData
    }
}