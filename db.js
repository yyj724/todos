const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'todo_user',
    password: 'todo1234',
    database: 'todo_app',
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool; 
