const db = require('../config/database');

class AuthChecker {
    // проверяет существует ли такой пользователь
    
    
    // если пользователь не вошел, переправляет его на страницу логина
    isLoggedIn(req, res, next) {
        if(!req.session.userId && !req.session.role) {
            return res.redirect('/auth/login');
        }
        next();
    }

    // если пользователь уже вошел, переправляет его на главную страницу
    alreadyLogged(req, res, next) {
        if(req.session.userId && req.session.role) {
            return res.redirect('/');
        }
        next();
    }
}

module.exports = new AuthChecker();