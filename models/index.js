const dbConfig = require('../configs/configs.js');

const Sequelize = require('sequelize');

const mysql = require("mysql2");

(async function () {
  // Open the connection to MySQL server
  const conn = mysql.createConnection({
    host: `${dbConfig.HOST}`,
    user: `${dbConfig.USER}`,
    password: `${dbConfig.PASSWORD}`,
  });

  // Run create database statement
   conn.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.DB}`,(err,res) => {
    if(err){
        console.log("Error" + err);
    } else if(res){
        console.log("Database Created");
    }
   });
})();

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.DIALECT,
        operatorsAliases: false,

        pool: {
            max: dbConfig.POOL.MAX,
            min: dbConfig.POOL.MIN,
            acquire: dbConfig.POOL.ACQUIRE,
            idle: dbConfig.POOL.IDLE

        }
    }
)

sequelize.authenticate().then(() => {
    console.log('Database Connected Successfully..');
}).catch(err => {
    console.log('Error'+ err);
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.compound = require('./CompoundModel.js')(sequelize, Sequelize);

db.sequelize.sync({ force: false }).then(() => {
    console.log('Database Synced Successfully...')
});

module.exports = db ;