class IndexController {
    async index(req, res, next) {
        res.render('index');
    }
}

module.exports = new IndexController();