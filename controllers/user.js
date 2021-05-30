const db = require('../config/database');
const path = require('path');
const bcrypt = require('bcrypt');

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
                q = 'INSERT INTO user (email, password, nickname, registered_at) VALUES('
                + `'${email}', '${hashedPassword}', '${nickname}', NOW())`;
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
            const q = `SELECT u.user_id AS user_id, u.password AS password, r.role AS role FROM user AS u`
                + ` INNER JOIN role AS r ON u.role = r.role_id WHERE u.email = '${email}'`;
            const result = await db.query(q);

            // пользователь существует
            if(result[0].length > 0) {
                const same = await bcrypt.compare(password, result[0][0].password);
                if(same) {
                    // верный пароль
                    req.session.userId = result[0][0].user_id;
                    req.session.role = result[0][0].role;
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
            if(!nickname) {
                console.log('no nickname');
                return res.status(404).render('notfound');
            }
            const result = await db.query(`SELECT nickname, user_id AS id FROM user WHERE nickname='${nickname}'`);

            // если пользователь с таким ником найден
            if(result[0].length > 0) {
                console.log(result[0][0]);
                // TODO: user page
            } else {
                return res.status(404).render('notfound', {
                    message: `Cannot find user ${req.params.nickname}`
                });
            }
        } catch (error) {
            console.log(error);
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