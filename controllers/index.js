class IndexController {
    async index(req, res, next) {
        res.render('index', {
            title: 'Main Page'
        });
    }
}

module.exports = new IndexController();