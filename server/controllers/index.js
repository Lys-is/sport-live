
class Constrollers {
    async auth(req, res, next) {
        res.render('auth', {
            type: 'login',
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
    async get__login(req, res, next) {
        res.render('auth', {
            type: 'login',
            title: 'Авторизация',
            auth: req.user || false
        });
    }

    async get__registration(req, res, next) {
        res.render('auth', {
            type: 'registration',
            title: 'Авторизация',
            auth: req.user || false
        });
    }
    api = require('./api')
}
    
module.exports = new Constrollers()