const Router = require('express').Router;
const productController = require('../controllers/ProductController');
const auth = require('../middleware/Auth');

var productRouter = module.exports = new Router();
productRouter.get('/search',productController.search);

productRouter.get('/:productID',productController.getDetail);

productRouter.put('/:productID',auth,productController.updateProduct);

productRouter.delete('/:productID',auth,productController.delete);

productRouter.get('/',productController.getType);

productRouter.post('/',auth,productController.addProduct);
