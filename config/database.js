const mysql = require('mysql2');

const db = mysql.createPool({
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    database: process.env.MYSQL_DB,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
});

db.getConnection(err => {
    if(err) {
        throw err
    }
    console.log('MySQL Connected');
});

module.exports = db;