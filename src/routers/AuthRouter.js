const Router = require('express').Router;
const authController = require('../controllers/AuthenticationController');
const auth = require('../middleware/Auth');

var authRouter = module.exports = new Router();

authRouter.post('/signin',authController.signIn);
authRouter.post('/signup',authController.signUp);

