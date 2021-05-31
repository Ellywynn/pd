const db = require('../config/database');
const path = require('path');
const bcrypt = require('bcrypt');
const e = require('cors');

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

                res
                  .status(201)
                  .render('index', {
                    title: 'Main Page'
                });
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
                      .status(201)
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
             registered_at AS regtime FROM user WHERE nickname='${nickname}'`);
            // если пользователь с таким ником найден
            if(result[0].length > 0) {
                const user = result[0][0].nickname;
                const user_id = result[0][0].id;
                let liked = [];
                let posts = [];
                // id понравившихся постов
                result = await db.query(`SELECT post_id FROM post_like WHERE user_id = ${user_id}`);

                // если пользователь оценил какие-то посты, получить их
                if(result[0].length > 0) {
                    let post_ids = [];
                    for(let i = 0; i < result[0].length; i++) {
                        post_ids.push(result[0][i].post_id);
                    }

                    // посты, которые понравились юзеру
                    result = await db.query(
                        `SELECT p.post_id, p.title, 
                        DATE_FORMAT(p.last_update, '%d %M %Y at %h:%i:%s') AS last_update,
                        COUNT(pl.post_id) AS likes
                        FROM post AS p 
                        LEFT JOIN post_like AS pl ON pl.post_id = p.post_id 
                        WHERE p.post_id IN (${post_ids.join()})
                        GROUP BY p.post_id, p.title, last_update`);

                    liked = result[0];
                }

                // посты, сделанные пользователем
                const q = ` SELECT p.post_id, p.title, u.nickname AS author,
                            DATE_FORMAT(p.last_update, '%d %M %Y at %h:%i:%s') AS last_update,
                            COUNT(l.post_id) AS likes
                            FROM post AS p INNER JOIN user AS u ON p.user_id = u.user_id
                            LEFT JOIN post_like AS l ON l.post_id = p.post_id
                            WHERE p.user_id = ${user_id}
                            GROUP BY p.post_id, p.title, author, last_update`;
                result = await db.query(q);

                posts = result[0];

                res.render('user', {
                    posts,
                    user,
                    liked
                });
            } else {
                return res.status(404).render('notfound', {
                    message: `Cannot find user ${req.params.nickname}`
                });
            }
        } catch (error) {
            console.error(error);
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

module.exports = new User();