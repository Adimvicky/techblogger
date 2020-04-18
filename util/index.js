const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = {
    hashPassword : async function(password){
        let hash = await bcrypt.hash(password,10);
        if(!hash) return false;
        return hash;
    },
    signToken : function(data){
        let token = jwt.sign(data,config.JWT_SECRET);
        if(!token) return false;
        return token;
    },
    validateFields : function(req,res,requiredFields){
        for(let field of requiredFields){
            if(!req.body[field]){
                (()=>res.status(400).send({success : false,message : `You have to provide your ${field}`}))();
                return false;
            }
        }
        return true;
    }
}
