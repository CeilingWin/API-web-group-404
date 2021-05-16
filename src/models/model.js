const database = require('./Database');

class Model{
    constructor(modelName, columnsName){
        this.db = database;
        this.modelName = modelName;
        this.columnsName = columnsName
    }

    async findById(id){
        let result = await this.db.query('SELECT * FROM ?? WHERE id=?',[this.modelName,id]);
        return result[0];
    }

    async getAll(){
        return await this.db.query('SELECT * FROM ??',[this.modelName]);
    }

    async save(model){
        let listColumnName = [];
        let listValues = [];
        for (let index = 0; index < this.columnsName.length; index++) {
            const columnName = this.columnsName[index];
            listColumnName[index] = this.db.escapeId(columnName); 
            listValues.push(this.db.escape(model[columnName]));
        }
        let columnName = listColumnName.join(',');
        let values = listValues.join(',');
        let sql = `INSERT INTO ${this.modelName} (${columnName}) VALUES (${values})`;
        return (await this.db.query(sql)).affectedRows == 1;
    }

    async update(id,data){
        let sets = [];
        for (let key in data){
            if (key!=='id' && this.columnsName.find((v)=>v===key)){
                sets.push(this.db.escapeId(key)+'='+this.db.escape(data[key]));
            }
        }
        sets = sets.join(',');
        let sql = `UPDATE ${this.modelName} SET ${sets} WHERE id= ?`;
        return (await this.db.query(sql,[id])).changedRows === 1;
    }
}

module.exports = Model;