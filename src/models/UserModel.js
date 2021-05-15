const Model = require('./Model');

class UserModel extends Model{
    constructor(){
        super('User');
    }

    async findByEmail(email){
        let result = await this.db.query('SELECT * FROM ?? WHERE email=?',[this.modelName,email]);
        return result.length > 0? result[0] : null;
    }
}

module.exports = UserModel;