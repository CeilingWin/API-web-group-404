const config = require('config');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

const userModel = new UserModel();
let secretKey = config.get('token.secret_key');
let exp = config.get('token.exp');

var authentication = module.exports = {
    login: async function(req,res){
        let email = req.body.email;
        let password = req.body.password;
        if (!email || !password){
            return res.status(400).send('Invalid email or password');
        }
        let user = await userModel.findByEmail(email);
        if (user && password === user.password){
            let publicUserData = {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                isAdmin: user.isAdmin
            }
            publicUserData.token = jwt.sign(publicUserData,secretKey,{expiresIn:exp});
            return res.status(200).send(publicUserData);
        } else {
            res.status(401).send('Wrong email or password');
        }
    }
}