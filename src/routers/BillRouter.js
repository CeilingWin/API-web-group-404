const Router = require('express').Router;
const billController = require('../controllers/BillController');
const auth = require('../middleware/Auth');

var billRouter = module.exports = new Router();

billRouter.get('/',auth,billController.getCart);

billRouter.get('/history',auth,billController.getHistory);

billRouter.get('/buy',auth,billController.buy);