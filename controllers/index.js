class IndexController {
    async index(req, res, next) {
        res.render('index', {
            title: 'Main Page'
        });
    }
    async register(req, res, next) {
        res.render('registration', {
            title: 'Registration',
            email : '',
            password: '',
            nickname: '',
            errors: []
        });
    }
    async login(req, res, next) {
        res.render('login', {
            title: 'Login',
            email: '',
            password: '',
            errors: []
        });
    }
}

module.exports = new IndexController();