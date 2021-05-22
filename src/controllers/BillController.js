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
    }
}