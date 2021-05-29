// подключение необходимых библиотек
const express = require('express');
const path = require('path');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const db = require('./config/database');
const errorHandler = require('./middleware/ErrorHandler');

// роутеры
const indexRouter = require('./routes/index');
const postRouter = require('./routes/post');
const authRouter = require('./routes/auth');

// порт сервера
const PORT = process.env.PORT || 80;

// создание express приложения
const app = express();

// позволяет приложению использовать json формат данных
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(fileUpload());

// инициализация статического каталога
app.use(express.static(path.resolve(__dirname, 'public')));

// api
app.use('/', indexRouter);
app.use('/post', postRouter);
app.use('/auth', authRouter);

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