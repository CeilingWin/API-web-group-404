const mysql = require('mysql');
const config = require('config');

var db = module.exports = {
    connect: function(){
        this.connection = mysql.createPool({
            host: config.get('db.host'),
            port: config.get('db.port'),
            user: config.get('db.user'),
            password: config.get('db.password'),
            database: config.get('db.database'),
            charset: config.get('db.charset'),
            connectionLimit: config.get('db.connectionLimit')
        });
        console.log("Connected database");
    },

    query: async function(sql,values){
        let self = this;
        if (!values) values = [];
        return await new Promise((resolve,reject)=>{
            self.connection.query(sql,values,(error, result, fields)=>{
                if (error) reject(error); 
                else resolve(result);
            });
        });
    }
}

db.connect();