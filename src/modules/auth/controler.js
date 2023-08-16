const bcrypt = require('bcrypt');
const auth = require('../../jwt');
const dataTable = 'auth';

module.exports = function (dbInjected) {

    let db = dbInjected;

    if (!db) {
        db = require("../../db/mysql");
    }

    const login = async (user, password) => {
        const data = await db.query(dataTable, {user: user});
        
        return bcrypt.compare(password, data.password)
        .then(result => {
            if(result === true){
                return auth.assignToken({ ...data});
            }
            else{
                throw new Error('404 Not Found');
            }
        });
    }

    const addData = async (data) => {
        const authData = {
            id: data.id,
        }
        if (data.user) {
            authData.user = data.user;
        }
        if (data.password) {
            authData.password = await bcrypt.hash(data.password.toString(), 5);
        }
        return db.addData(dataTable, authData);
    }
    return {
        addData,
        login
    }
}