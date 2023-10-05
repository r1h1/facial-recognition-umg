const express = require('express');
const router = express.Router();
const security = require('./security');
const responses = require('../../network/responses');
const controller = require('./index');

//RUTAS PARA CONSULTAR
router.get('/', security(), data);
router.get('/:id', security(), oneData);
router.get('/rol/:idrol', security(), rolData);

//CONSULTAR TODOS LOS ÍTEMS
async function data(req, res, next) {
    try {
        const items = await controller.data().then((items) => {
            responses.success(req, res, items, 200);
        });
    }
    catch (err) {
        next(err);
    }
};

//CONSULTAR UN SOLO ÍTEM
async function oneData(req, res, next) {
    try {
        const items = await controller.oneData(req.params.id).then((items) => {
            responses.success(req, res, items, 200);
        });
    }
    catch (err) {
        next(err);
    }
};


//CONSULTAR UN SOLO ÍTEM
async function rolData(req, res, next) {
    try {
        const items = await controller.rolData(req.params.idrol).then((items) => {
            responses.success(req, res, items, 200);
        });
    }
    catch (err) {
        next(err);
    }
};


//EXPORTA LOS DATOS
module.exports = router;