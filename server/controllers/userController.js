const User = require('../models/User');
const util = require('../util')
const bcryt = require('bcrypt');


module.exports = {
    createAccount : async function(req,res,next){
        let fieldsValid = util.validateFields(req,res,['name','email','password']);
        if(fieldsValid){
            let { name, email,password } = req.body;

            let existingUser = await User.findOne({email});
            if(existingUser) return res.status(400).send({success : false,message : 'A user with this email already exists'});

            let hashedPassword = await util.hashPassword(password);
            if(!hashedPassword) return res.status(500).send({success : false,message : 'Account creation failed (passsword hashing failed)'});

            User.create({
                name,
                email,
                password : hashedPassword
            })
            .then((user) => {
                let token = util.signToken({userId : user.id});
                if(token){
                    return res.status(201).send({success : true, message : 'Account created successfully',token,data : user})
                } else {
                    next(new Error('Failed to sign JWT'));
                }
            })
            .catch(e => {
                console.log('Error => ',e)
                return res.status(500).send({success : false,message : 'Account creation failed'});
            })
        }
    },
    login : async function(req,res,next){
        let fieldsValid = util.validateFields(req,res,['email','password']);
        if(fieldsValid){
            let { email, password } = req.body;
            let user = await User.findOne({email});
            if(!user) return res.status(404).send({success : false, message : 'A user with that email does not exist'});
            let passwordMatches = bcryt.compareSync(password,user.password);
            if(passwordMatches){
                let token = util.signToken({userId : user.id});
                if(token){
                    return res.json({success : true, message : 'Login successful',token,data : user})
                } else {
                    next(new Error('Failed to sign JWT'));
                }
            } else {
                return res.status(400).send({success : false, message : 'Password incorrect'});
            }
        }
    },
    updateUser : async function(req,res,next){
        let { name, email } = req.body;
        let updatedUser = await User.updateOne({_id:req.userId},{name,email});
        if(updatedUser){
            let user = await User.findOne({_id:req.userId});
            return res.json({success:true,message : "Profile updated",data:user});
        } else {
            return res.status(500).send({success:false,message:"Something went wrong on our end"});
        }
    },
    // getUserData : async function(req,res,next){
    //     let user = await User.findOne({id:req.userId});
    //     if(user){
    //         return res.json({success:true,message:"successful",data:user});
    //     } else {
    //         return res.status(404).send({success:false,message:"user not found"});
    //     }
    // }
}