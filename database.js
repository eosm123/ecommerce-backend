const mysql = require('mysql2/promise');

// create connection pool to manage connections
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnection: true,
    // when more people wanna join in the connection, the connection pool will create new connection
    // up to a limit of 10 -> removed if idle
    connectionLimit: 10,
    queueLimit: 0
});

// To create modules -> function/variables to share with other JS files
module.exports = pool;
