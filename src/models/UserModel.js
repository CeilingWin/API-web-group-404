const Model = require('./Model');
const {isEmail} = require('../utils/StringUtil');

const COLUMN_NAME_TABLE_USER = [
    'id',
    'fullName',
    'email',
    'password',
    'isAdmin'
]
class UserModel extends Model{
    constructor(){
        super('User',COLUMN_NAME_TABLE_USER);
    }

    async findByEmail(email){
        email = String(email);
        let result = await this.db.query('SELECT * FROM ?? WHERE email=?',[this.modelName,email]);
        return result.length > 0? result[0] : null;
    }

    async isUsedEmail(email){
        let user = await this.findByEmail(email);
        return user? true : false;
    }
}

module.exports = UserModel;