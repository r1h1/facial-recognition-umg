const auth = require('../../jwt');
module.exports = function(checkAuthentication){

    function middleware(req, res, next){
        auth.checkToken.confirmToken(req);
        next();
    }
    
    return middleware;
}