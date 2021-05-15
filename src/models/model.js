const database = require('../models/Database');

class Model{
    constructor(modelName){
        this.db = database;
        this.modelName = modelName;
    }

    async findById(id){
        let result = await this.db.query('SELECT * FROM ?? WHERE id=?',[this.modelName,id]);
        return result[0];
    }

    async getAll(){
        return await this.db.query('SELECT * FROM ??',[this.modelName]);
    }
}

module.exports = Model;