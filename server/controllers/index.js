
class Constrollers {
    async auth(req, res, next) {
        res.render('auth', {
            title: 'Авторизация',
            auth: req.user || false
        });
    }
    async lk(req, res, next) {
        res.render('lk', {
            title: 'ЛК',
            auth: req.user || false
        });
    }
    api = require('./api')
}
    
module.exports = new Constrollers()