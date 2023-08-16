const express = require('express');
const router = express.Router();
const security = require('./security');
const responses = require('../../network/responses');
const controller = require('./index');


//RUTAS PARA CONSULTAR
router.get('/:createdDate/:finishDate', security(), dataWithDates);

//CONSULTAR UN SOLO ÍTEM
async function dataWithDates(req, res, next) {
    try {
        const items = await controller.dataWithDates(req.params.createdDate, req.params.finishDate).then((items) => {
            responses.success(req, res, items, 200);
        });
    }
    catch (err) {
        next(err);
    }
};


//EXPORTA LOS DATOS
module.exports = router;