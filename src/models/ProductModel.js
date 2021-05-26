const Model = require('./Model');

const COLUMN_NAME_TABLE_PRODUCT = [
    'id',
    'name',
    'type',
    'price',
    'quantity',
    'userID',
    'imgUrl',
    'description'
]
class ProductModel extends Model{
    constructor(){
        super('Product',COLUMN_NAME_TABLE_PRODUCT);
    }

    async getType(type,page = 0,limit = 10,sortBy,order){
        sortBy = sortBy || 'id';
        order  = order === 'asc'? order: 'desc';
        let startIndex = page*limit;
        type = String(type).toLowerCase();
        let listColumnName = ['id','name','type','price','quantity','imgUrl','description'];
        if (type !== 'all'){
            return await this.db.query( 'SELECT ?? FROM ?? WHERE type=? ORDER BY ?? '+order+' LIMIT ?,?',
            [listColumnName,this.modelName,type,sortBy,startIndex,limit]);
        } else {
            return await this.db.query('SELECT ?? FROM ?? ORDER BY ?? '+order+' LIMIT ?,?',
            [listColumnName,this.modelName,sortBy,startIndex,limit]);
        }
    }

    async searchByName(name,type,limit = 10){
        name = '%'+name+'%';
        let listColumnName = ['id','name','type','price','quantity','imgUrl'];
        if (type === 'all') type = '%%';
        console.log(type);
        let sql = 'SELECT ?? FROM ?? WHERE name LIKE ? AND `type` LIKE ? ORDER BY LENGTH(`name`) ASC LIMIT ?';
        return await this.db.query(sql,[listColumnName,this.modelName,name,type,limit]);
    }    
}

module.exports = ProductModel;