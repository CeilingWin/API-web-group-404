const Router = require('express').Router;
const userController = require('../controllers/UserController');
const auth = require('../middleware/Auth');

var userRouter = module.exports = new Router();

userRouter.get('/',auth,userController.getUserInfo);