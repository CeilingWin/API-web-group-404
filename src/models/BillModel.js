const Model = require('./Model');

const COLUMN_NAME_TABLE_BILL = [
    'id',
    'userID',
    'productID',
    'quantity',
    'pay',
    'created'
]
class UserModel extends Model{
    constructor(){
        super('Bill',COLUMN_NAME_TABLE_BILL);
    }

    async getCartByUserId(userId){
        let sql = `SELECT ??,?? as maxQuantity FROM Bill
                    JOIN Product ON Bill.productID = Product.id
                    WHERE Bill.userID = ? AND Bill.pay = 0`;
        let listSelect = ['Bill.id','Bill.productID','Bill.quantity','Bill.created','Product.name','Product.price',
                            'Product.imgUrl'];
        return await this.db.query(sql,[listSelect,'Product.quantity',userId]);
    }

    async getBillHistory(userId){
        let sql = `SELECT ?? FROM Bill
                    JOIN Product ON Bill.productID = Product.id
                    WHERE Bill.userID = ? AND Bill.pay=1`
        let listSelect = ['Bill.id','Bill.productID','Bill.quantity','Bill.modified','Product.name','Product.price',
                            'Product.imgUrl'];
        return await this.db.query(sql,[listSelect,userId]);
    }

    async payBill(billId){
        let sql = `UPDATE ?? SET pay = 1 WHERE id = ?`;
        return await this.db.query(sql,[this.modelName,billId]);
    }
}

module.exports = UserModel;