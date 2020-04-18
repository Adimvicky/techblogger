const jwt = require('jsonwebtoken');
const config = require('../config');
const util = require('../util');

module.exports = {
    isLoggedIn : function(req,res,next){
        let { token } = req.headers;
        if(!token){
            return res.status(403).json({success : false,message : 'You do not have authorization to do that.'});
        }
        jwt.verify(token,config.JWT_SECRET,async(err,decodedToken) => {
            if(err) return res.status(403).json({success:false,message : 'Invalid or malformed token'});
            if(!decodedToken) return res.status(403).json({success : false,message : 'Not authorized'});

            req.userId = decodedToken.userId;
            return next();
        })
    }
}