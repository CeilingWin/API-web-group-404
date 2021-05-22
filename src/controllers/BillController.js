const BillModel = require('../models/BillModel');
const ProductModel = require('../models/ProductModel');

const billModel = new BillModel();
const productModel = new ProductModel();
var BillController = module.exports = {
    getCart: async function(req,res){
        let userId = req.user.id;
        try {
            let cart = await billModel.getCartByUserId(userId);
            res.status(200).send(cart);
        } catch (error) {
            res.status(400).send(error.message);
        }
    },

    getHistory: async function(req,res){
        let userId = req.user.id;
        try {
            let bill = await billModel.getBillHistory(userId);
            res.status(200).send(bill);
        } catch (error) {
            res.status(400).send(error.message);
        }
    },

    buy: async function(req,res){
        let userId = req.user.id;
        let cart;
        try {
            cart = await billModel.getCartByUserId(userId);
        } catch (error){
            return res.status(400).send(error.message);
        }
        if (cart && cart.length > 0){
            let listBillCannotPay = cart.filter((bill)=>{return (bill.quantity>bill.maxQuantity)});
            let listIdBillCannotPay = listBillCannotPay.map(b=>{
                return {
                    billID: b.id,
                    maxQuantity: b.maxQuantity}
                });
            if (listBillCannotPay.length>0) return res.status(402).send(listIdBillCannotPay);
            try{
                for (let i=0;i<cart.length;i++){
                    let bill = cart[i];
                    await billModel.payBill(bill.id);
                    let newQuantity = bill.maxQuantity - bill.quantity;
                    await productModel.update(bill.productID,{quantity:newQuantity});
                }
                let cart2 = await billModel.getCartByUserId(userId);
                res.status(200).send('Buy success');
            } catch(error){
                return res.status(400).send(error.message);
            }
        } else{
            return res.status(400).send('Need add product to cart')
        }
    },

    addProductToCart: async function(req,res){
        let userId = req.user.id;
        let productId = req.params.productID;
        if (!productId) return res.status(400).send('Require productID');

        try {
            let bill = await billModel.findBill(userId,productId);
            if (bill){
                let newQuantity = bill.quantity + 1;
                await billModel.update(bill.id,{quantity:newQuantity});
                res.status(200).send('Add product success');
            } else {
                bill = {
                    userID: userId,
                    productID: productId,
                    quantity: 1,
                    pay: 0  
                }
                await billModel.save(bill);
                res.status(200).send('Add new product to cart success');
            }
        } catch (error) {
            res.status(400).send(error.message);
        }
    },

    deleteProductFromCart : async function(req,res){
        let userId = req.user.id;
        let productId = req.params.productID;
        if (!productId) return res.status(400).send('Require productID');
        try {
            let bill = await billModel.findBill(userId,productId);
            if (!bill) return res.status(400).send('Unknown bill');
            let newQuantity = bill.quantity - 1;
            if (newQuantity === 0){
                billModel.deleteById(bill.id);
                res.status(200).send('Delete bill success');
            } else {
                billModel.update(bill.id,{quantity: newQuantity});
                res.status(200).send('Delete product success');
            }
        } catch (error) {
            res.status(400).send(error.message);
        }
        
    }
}