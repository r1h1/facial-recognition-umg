const jwt = require('jsonwebtoken');
const config = require('../config');
const error = require('../middleware/errors');
const secret = config.jwt.secret;

const assignToken = (data) => {
    return jwt.sign(data, secret);
}

const verifyToken = (token) => {
    return jwt.verify(token, secret);
}

const checkToken = {
    confirmToken: function (req) {
        const decoded = decodedHeader(req);
    }
}

const obtainToken = (authorized) => {
    if(!authorized){
        throw error('Unauthrorized', 401);
    }
    if(authorized.indexOf('Bearer') === -1){
        throw error('Invalid Format', 500);
    }

    let token = authorized.replace('Bearer ', '');
    return token;
}

const decodedHeader = (req) => {
    const authorized = req.headers.authorization || '';
    const token = obtainToken(authorized);
    const decoded = verifyToken(token);

    req.user = decoded;

    return decoded;
}


module.exports = {
    assignToken,
    checkToken
}