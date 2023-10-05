const express = require('express');
const router = express.Router();
const security = require('./security');
const responses = require('../../network/responses');
const controller = require('./index');

//RUTAS PARA CONSULTAR
router.get('/', security(), data);
router.get('/:id', security(), oneData);
router.get('/searchVisitor/:accesscode', security(), visitorData);
router.get('/filterVisitors/:id', security(), dataFilterWithResidentId);
router.post('/', security(), addData);
router.put('/', security(), deleteData);

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


//CONSULTAR TODOS LOS ÍTEMS FILTRADO POR USUARIO
async function dataFilterWithResidentId(req, res, next) {
    try {
        const items = await controller.dataFilterWithResidentId(req.params.id).then((items) => {
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

//CONSULTAR VISITANTE POR CÓDIGO DE ACCESO
async function visitorData(req, res, next) {
    try {
        res.setHeader('Access-Control-Allow-Origin', '*');
        const items = await controller.visitorData(req.params.accesscode).then((items) => {
            responses.success(req, res, items, 200);
        });
    }
    catch (err) {
        next(err);
    }
};

//CREAR UN NUEVO ITEM
async function addData(req, res, next) {
    try {
        res.setHeader('Access-Control-Allow-Origin', '*');
        const items = await controller.addData(req.body);
        if (req.body.id == 0) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            message = 'Created OK';
        }
        else {
            res.setHeader('Access-Control-Allow-Origin', '*');
            message = 'Updated OK';
        }
        responses.success(req, res, items, 201);
    }
    catch (err) {
        next(err);
    }
};

//ELIMINAR ITEM
async function deleteData(req, res, next) {
    try {
        const items = await controller.deleteData(req.body).then((items) => {
            responses.success(req, res, 'Dropped OK', 200);
        });
    }
    catch (err) {
        next(err);
    }
};


//EXPORTA LOS DATOS
module.exports = router;