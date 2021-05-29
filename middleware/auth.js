const db = require('../config/database');

class AuthChecker {
    // проверяет существует ли такой пользователь
    isAuthorized(req, res, next) {
        const id = req.session.user_id;
        db.query(`SELECT user_id FROM user WHERE user_id = ${id}`)
            .then(result => {
                // если пользователь вошел
                if(result[0][0].user_id) {
                    return res.redirect('/');
                }

                next();
            })
            .catch(error => {
                return res.redirect('/');
            });
    }
    // проверяет вошел ли пользователь
    isLoggedIn(req, res, next) {
        // если пользователь вошел
        if(req.session.userId && req.session.role) {
            return res.redirect('/');
        }
        next();
    }
}

module.exports = new AuthChecker();