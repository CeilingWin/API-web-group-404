const Model = require('./Model');

const COLUMN_NAME_TABLE_BILL = [
    'id',
    'userID',
    'productID',
    'quantity',
    'pay',
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

    async findBill(userId,productId){
        let sql = `SELECT * FROM Bill WHERE userID = ? AND productID = ? AND pay = 0`;
        let bills = await this.db.query(sql,[userId,productId]);
        return bills[0];
    }

    async deleteAllBillWithProductId(productId){
        let sql = `DELETE FROM Bill WHERE productID = ?`;
        await this.db.query(sql,[productId]);
    }
}

module.exports = UserModel;