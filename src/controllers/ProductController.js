const ProductModel = require('../models/ProductModel');

const productModel = new ProductModel();
var productController = module.exports = {
    getDetail: async function(req,res){
        let productId = req.params.productID;
        if (!productId || Number.isNaN(Number(productId))) return res.status(400).send('Invalid product ID');
        let product = await productModel.findById(productId);
        if (product)
            res.status(200).send(product);
        else 
            res.status(400).send('Product ID not found');
    },

    getType: async function(req,res){
        let {type,page,limit,sortBy,order} = req.query;
        if (!type) type = 'all';
        page = Number(page);
        limit = Number(limit);
        console.log(req.query);
        if (Number.isNaN(page) || Number.isNaN(limit)) return res.status(400).send('Page and limit param require number');
        try {
            let listProduct = await productModel.getType(type,page,limit,sortBy,order);
            res.status(200).send(listProduct);
        } catch(error){
            res.status(400).send(error.message);
        }
    },

    search: async function(req,res){
        let {name,type,limit} = req.query;
        if (!name) return res.status(400).send('Invalid search param');
        if (limit === undefined || limit === null) limit = 10;
        limit = Number(limit);
        if (Number.isNaN(limit)) return res.status(400).send('Limit param require number');
        if (!type) type = 'all';
        try {
            return res.status(200).send(await productModel.searchByName(name,type,limit));
        } catch (error) {
            res.status(400).send(error.message);
        }
    },

    addProduct: async function(req,res){
        let userID = req.user.id;
        let {name,type,price,quantity,imgUrl,description} = req.body;
        if (!(name && type && price && quantity && imgUrl && description)) res.status(400).send('Bad request');
        
        let product = {
            name: name,
            type: type,
            price: price,
            quantity: quantity,
            imgUrl: imgUrl,
            description: description,
            userID: userID
        }

        try {
            if (await productModel.save(product)) res.status(200).send('Add product success');
            else res.status(400).send('Add product failed');
            console.log("Add product ", product);
        } catch (error) {
            res.status(400).send(error.message);
        }
        
    }
}