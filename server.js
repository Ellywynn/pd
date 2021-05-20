// инициализация переменных в .env файле
require('dotenv').config();

// connect routes
// const studentRouter = require('./routes/studentRouter');
// const teacherRouter = require('./routes/teacherRouter');

const express = require('express');
const path = require('path');
const db = require('./config/database');
const errorHandler = require('./middleware/ErrorHandler');

// порт сервера
const PORT = process.env.PORT || 80;

// создание express приложения
const app = express();

// позволяет приложению использовать json формат данных
app.use(express.json());
// инициализация статического каталога
app.use(express.static(path.resolve(__dirname, 'public')));

// application api implemented with routes
// app.use('/api', studentRouter);
// app.use('/api', teacherRouter);

// middleware обработки ошибок
app.use(errorHandler);

// запуск приложения
start();

// функция подключается к базе данных и запускает сервер
async function start() {
    try {
        await db.connect();
        console.log(`Successfully connected to the database '${process.env.DB_NAME}'`);
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch(error) {
        console.error(error);
    }
}