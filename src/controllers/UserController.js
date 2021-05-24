const UserModel = require('../models/UserModel');

const userModel = new UserModel();
var UserController = module.exports = {
    // TODO: block user, unblock user

    getUserInfo: async function(req,res){
        let userId = req.user.id;
        try {
            let user = await userModel.findById(userId);
            if (user){
                res.status(200).send({
                    id: userId,
                    email: user.email,
                    isAdmin: user.idAdmin,
                    fullName: user.fullName
                })
            } else {
                res.status(400).send('User not found');
            } 
        } catch (error) {
            res.status(400).send(error.message);
        }
    }
}