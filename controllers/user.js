const db = require('../config/database');
const path = require('path');
const bcrypt = require('bcrypt');
const sharp = require('sharp');

// round count for generating salt
const roundCount = 11;
let errors = [];

class User {
    async register(req, res, next) {
        try {
            errors = [];
            let {email, password, nickname} = req.body;

            if(!email || !password || !nickname) {
                throw new Error('Неправильно заданы данные пользователя');
            }

            email = email.toLowerCase();
            nickname = nickname.toLowerCase();

            let userExists = false;

            // TODO: убрать велосипед..
            let q = `(SELECT email FROM user WHERE email LIKE '${email}')`;
            let emailResult = await db.query(q);

            q = `SELECT nickname FROM user WHERE nickname LIKE '${nickname}'`;
            let nicknameResult = await db.query(q);

            if(emailResult[0].length > 0) {
                errors.push('Данная почта уже привязана к другому аккаунту');
                userExists = true;
            }

            if(nicknameResult[0].length > 0) {
                errors.push('Данный никнейм уже занят');
                userExists = true;
            }

            // если ник и почта свободны
            if(!userExists) {
                const hashedPassword = await bcrypt.hash(password, roundCount);

                // create user
                q = `INSERT INTO user (email, password, nickname, registered_at) VALUES(
                    '${email}', '${hashedPassword}', '${nickname}', NOW())`;
                await db.query(q);

                // сразу войти при создании пользователя
                q = `SELECT u.user_id AS user_id, u.password AS password,
                    r.role AS role, u.nickname AS nickname FROM user AS u
                    INNER JOIN role AS r ON u.role = r.role_id WHERE u.email = '${email}'`;
                const result = await db.query(q);

                req.session.userId = result[0][0].user_id;
                req.session.role = result[0][0].role;
                req.session.nickname = result[0][0].nickname;
                res
                    .status(200)
                    .redirect('/');
            } else {                
                // если пользователь уже существует, сообщить об этом
                res
                  .status(400)
                  .render('registration', {
                    title: 'Registration',
                    email,
                    password,
                    nickname,
                    errors
                  });
            }
        } catch(e) {
            console.error(e);
        }
    }

    async login(req, res, next) {
        try {
            errors = [];
            const {email, password} = req.body;
            const q = `SELECT u.user_id AS user_id, u.password AS password,
                    r.role AS role, u.nickname AS nickname FROM user AS u
                    INNER JOIN role AS r ON u.role = r.role_id WHERE u.email = '${email}'`;
            const result = await db.query(q);

            // пользователь существует
            if(result[0].length > 0) {
                const same = await bcrypt.compare(password, result[0][0].password);
                if(same) {
                    // верный пароль
                    req.session.userId = result[0][0].user_id;
                    req.session.role = result[0][0].role;
                    req.session.nickname = result[0][0].nickname;
                    res
                      .status(200)
                      .redirect('/');
                } else {
                    // неверный пароль
                    invalidLogin(res, email, password);
                }
            } else {
                // пользователя не существует
                // произвести фейковые вычисления для безопасности
                const fakePass = `$2b$${roundCount}$invalidusernameaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`;
                await bcrypt.compare(password, fakePass);
                invalidLogin(res, email, password);
            }
        } catch (error) {
            console.error(error);
        }
    }

    logout(req, res, next) {
        try {
            req.session.destroy(() => {
                res.redirect('/');
            });
        } catch (error) {
            console.error(error);
        }
    }

    async getUser(req, res) {
        try {
            const nickname = req.params.nickname;
            let result = await db.query(`SELECT nickname, user_id AS id,
             DATE_FORMAT(registered_at, '%Y-%m-%i') AS regtime, avatar_path
             FROM user WHERE nickname='${nickname}'`);
            // если пользователь с таким ником найден
            if(result[0].length > 0) {
                const user = result[0][0].nickname;
                const user_id = result[0][0].id;
                const regTime = result[0][0].regtime;
                let avatar_path = result[0][0].avatar_path;

                avatar_path = validateAvatar(avatar_path);

                // id понравившихся постов
                let q = `SELECT COUNT(post_id) AS liked, post_id
                         FROM post_like
                         WHERE user_id = ${user_id}
                         GROUP BY post_id`;
                let liked = [];
                let posts = [];
                
                result = await db.query(q);

                let likedCount = 0;

                // если пользователь оценил какие-то посты, получить их
                if(result[0].length > 0) {
                    likedCount = result[0][0].liked;
                    let post_ids = [];
                    for(let i = 0; i < result[0].length; i++) {
                        post_ids.push(result[0][i].post_id);
                    }

                    // посты, которые понравились юзеру
                    result = await db.query(
                        `SELECT p.post_id, p.title, u.nickname AS author, p.content,
                        DATE_FORMAT(p.last_update, '%d-%m-%Y в %H:%i:%s') AS last_update,
                        u.avatar_path AS avatar_path,
                        COUNT(l.post_id) AS likes,
                        COUNT(c.user_id) AS comments
                        FROM post AS p 
                        LEFT JOIN user AS u ON p.user_id = u.user_id
                        LEFT JOIN post_like AS l ON p.post_id = l.post_id
                        LEFT JOIN comment AS c ON p.post_id = c.post_id
                        WHERE p.post_id IN (${post_ids.join()})
                        GROUP BY p.title, p.post_id, author, p.content, last_update, avatar_path`);

                    liked = result[0];
                    liked.map(post => post.avatar_path = validateAvatar(post.avatar_path));
                }

                // посты, сделанные пользователем
                q = ` SELECT p.post_id, p.title, u.nickname AS author,
                            DATE_FORMAT(p.last_update, '%d %M %Y at %H:%i:%s') AS last_update,
                            u.avatar_path AS avatar_path,
                            COUNT(l.post_id) AS likes, COUNT(c.post_id) AS comments
                            FROM post AS p
                            INNER JOIN user AS u ON p.user_id = u.user_id
                            LEFT JOIN post_like AS l ON l.post_id = p.post_id
                            LEFT JOIN comment AS c ON c.post_id = p.post_id
                            WHERE p.user_id = ${user_id}
                            GROUP BY p.post_id, p.title, author, last_update, avatar_path`;
                result = await db.query(q);

                posts = result[0];

                posts.map(post => post.avatar_path = validateAvatar(post.avatar_path));

                const postCount = posts.length;

                res.render('user', {
                    posts,
                    user,
                    liked,
                    regTime,
                    likedCount,
                    postCount,
                    avatar_path
                });
            } else {
                return res.status(404).render('notfound', {
                    message: `Пользователь не найден`
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    async uploadImage(req, res, next) {
        const avatar = req.files.avatar;

        if(!avatar) {
            return res.render('notfound', {
                message: 'Ошибка загрузки файла'
            });
        }

        // если файл неправильного формата
        if(avatar.mimetype !== 'image/png' && avatar.mimetype !== 'image/jpeg') {
            return res.render('notfound', {
                message: 'Можно загружать только файлы формата .png, .jpeg, .jpg'
            });
            // если размер файла больше 2мб или меньше 4кб
        } else if(avatar.size > 1024 * 1024 * 2 || avatar.size < 1024 * 4) {
            return res.render('notfound', {
                message: 'Размер файла слишком большой или слишком маленький(от 4кб до 2мб)'
            });
        } else {
            try {
                // если файл удовлетворяет требованиям
                // обрезать фотографию
                const filename = nickname + '.jpeg';
                const filepath = path.resolve(__dirname, '..', 'public', 'users', filename);

                // обрезать фотографию и сохранить ее
                await sharp(avatar.data)
                    .resize(200, 200)
                    .toFormat('jpeg')
                    .jpeg({quality: 90})
                    .toFile(filepath);

                // обновить информацию о новой фотографии
                const q = `UPDATE user SET avatar_path = '${filename}' WHERE nickname = '${nickname}'`;
                await db.query(q);

                res.redirect(`/user/${nickname}`);
            } catch(error) {
                console.error(error);
            }
        }
    }
}

function invalidLogin(res, email, password) {
    errors.push('Неправильный логин или пароль');
    res
      .status(401)
      .render('login', {
          title: 'Login',
          email,
          password,
          errors
      });
}

function validateAvatar(avatar_path) {
    if(avatar_path !== 'default.png') 
        return '/users/' + avatar_path;

    return '/' + avatar_path;
}

module.exports = new User();