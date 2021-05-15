const config = require('config');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');
const {isEmail} = require('../utils/StringUtil');

const userModel = new UserModel();
let secretKey = config.get('token.secret_key');
let exp = config.get('token.exp');

var authentication = module.exports = {
    signIn: async function(req,res){
        let {email, password} = req.body;
        if (!email || !password){
            return res.status(400).send('Invalid email or password');
        }
        let user = await userModel.findByEmail(email);
        if (user && password === user.password){
            let publicUserData = await authentication.addTokenToUserData(user);
            return res.status(200).send(publicUserData);
        } else {
            res.status(401).send('Wrong email or password');
        }
    },

    signUp: async function(req,res){
        let {fullName, email, password} = req.body;
        if (!fullName || !email || !password) return res.status(400).send('Bad request');

        // check param request
        email = String(email);
        if (!isEmail(email)) return res.status(400).send('Invalid email');

        fullName = String(fullName);
        if (fullName.length<5) return res.status(400).send('Full Name must has at least 5 characters');

        password = String(password);
        if (password.length<6) return res.status(400).send('Password must has at least 6 characters');

        // check unique email
        let isUsedEmail = await userModel.isUsedEmail(email);
        if (isUsedEmail) return res.status(400).send('The email is taken. Try another');

        let insertUserSuccess = await userModel.save({
            email: email,
            fullName: fullName,
            password: password,
            isAdmin: 0
        });
        try{
            let user = await userModel.findByEmail(email);
            return res.status(200).send(await authentication.addTokenToUserData(user));
        } catch(error) {
            return res.status(400).send(error.message);
        }
    },  

    addTokenToUserData: async function(user){
        let userData = {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            isAdmin: user.isAdmin
        }
        userData.token = await jwt.sign(userData,secretKey,{expiresIn:exp});
        return userData;
    }
}