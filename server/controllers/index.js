let Match = require('../models/match-model');
let User = require('../models/user-model');
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
    async get__panel(req, res) {
        let matches = await Match.find({});
        res.render('panel', {
            title: 'Панель управления',
            auth: req.user || false,
            matches
        });
    }
    async get__table(req, res) {
        let userAd = await User.findById(req.params.id);
        console.log(userAd.tablo_style);
        res.render('table', {
            id: req.params.id,
            title: 'Таблица',
            auth: userAd || false,
            style: userAd.tablo_style || 'style_1'
        });
    }
    api = require('./api')
}
    
module.exports = new Constrollers()