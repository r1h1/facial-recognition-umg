const db = require("../../db/mysql");
const controller = require("./controler");

module.exports = controller(db);