// подключение необходимых библиотек
const express = require('express');
const db = require('./config/database');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/ErrorHandler');

// роутеры
const indexRouter = require('./routes/indexRouter');
const postRouter = require('./routes/postRouter');

// порт сервера
const PORT = process.env.PORT || 80;

// создание express приложения
const app = express();

// позволяет приложению использовать json формат данных
app.use(express.json());
app.use(cors());

// инициализация статического каталога
app.use(express.static(path.resolve(__dirname, 'public')));

// api
app.use('/', indexRouter);
app.use('/post', postRouter);

// middleware обработки ошибок
app.use(errorHandler);

// template engine
app.set('view engine', 'ejs');




/*
    запуск приложения
*/
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