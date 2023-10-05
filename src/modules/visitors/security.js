const auth = require('../../jwt');
module.exports = function(checkAuthentication){

    function middleware(req, res, next){
        res.setHeader('Access-Control-Allow-Origin', '*');
        auth.checkToken.confirmToken(req);
        next();
    }
    
    return middleware;
}