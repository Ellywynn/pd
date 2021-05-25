// инициализация переменных в .env файле
require('dotenv').config();
const mysql = require("mysql2");

// асинхронное подключение к базе данных
const connection = mysql.createConnection({
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
}).promise();

module.exports = connection;