//REQUERIDOS PARA EL FUNCIONAMIENTO DEL PROYECTO
const express = require('express');
var cors = require('cors');
const config = require('./config');
const auth = require('./modules/auth/routes.js');
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
app.use('/api/v1/auth', auth);
app.use('/api/v1/banks', banks);

app.use(errors);

module.exports = app;