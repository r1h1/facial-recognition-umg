//REQUERIDOS PARA EL FUNCIONAMIENTO DEL PROYECTO
const express = require('express');
var cors = require('cors');
const config = require('./config');
const users = require('./modules/users/routes.js');
const rol = require('./modules/rol/routes.js');
const modules = require('./modules/modules/routes.js');
const productPerOrder = require('./modules/productPerOrder/routes.js');
const productExtraIngredients = require('./modules/productExtraIngredients/routes.js');
const products = require('./modules/products/routes.js');
const payOptions = require('./modules/payOptions/routes.js');
const payFiles = require('./modules/payFiles/routes.js');
const orders = require('./modules/orders/routes.js');
const invoice = require('./modules/invoice/routes.js');
const auth = require('./modules/auth/routes.js');
const reports = require('./modules/reports/routes.js');
const banks = require('./modules/banks/routes.js');
const morgan = require('morgan');
const { error } = require('./network/responses');
const errors = require('./network/errors');
const app = express();

//MIDDLEWARE
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

//ROUTERS
app.set('port', config.app.port);
app.use('/api/v1/reports', reports);
app.use('/api/v1/users', users);
app.use('/api/v1/rol', rol);
app.use('/api/v1/modules', modules);
app.use('/api/v1/productPerOrder', productPerOrder);
app.use('/api/v1/productExtraIngredients', productExtraIngredients);
app.use('/api/v1/products', products);
app.use('/api/v1/payOptions', payOptions);
app.use('/api/v1/payFiles', payFiles);
app.use('/api/v1/orders', orders);
app.use('/api/v1/invoice', invoice);
app.use('/api/v1/auth', auth);
app.use('/api/v1/banks', banks);

app.use(errors);

module.exports = app;