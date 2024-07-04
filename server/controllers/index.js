let Match = require('../models/match-model');
let User = require('../models/user-model');
let League = require('../models/league-model');
let Style = require('../models/style-model');

class Constrollers {
    async auth(req, res, next) {
        res.render('auth', {
            type: 'login',
            title: 'Авторизация',
            auth: req.user || false
        });
    }
    async lk(req, res, next) {
        let league = await League.findOne({creator: req.user.id});
        res.render('lk', {
            title: 'ЛК',
            league: league || false,
            auth: req.user || false,
            isAdmin: req.user.isAdmin
        });
    }
    async get__login(req, res, next) {
        res.render('auth', {
            type: 'login',
            title: 'Авторизация',
            auth: req.user || false
        });
    }
    async get__fans(req, res) {
        let league = req.fans_league
        res.render('fans/fans_o_lige', {
            league
        })
    }
    async get__registration(req, res, next) {
        res.render('auth', {
            type: 'registration',
            title: 'Авторизация',
            auth: req.user || false
        });
    }
    async get__panel(req, res) {
        console.log(req.params);
        let matches = await Match.find({creator: req.params.id})
        let userAd = await User.findById(req.params.id);
        let styles = await Style.find({creator: userAd._id});

        res.render('panel', {
            id: req.params.id,
            title: 'Панель управления',
            auth: userAd || false,
            matches,
            styles
        });
    }
    async get__table(req, res) {
        try{
            console.log(req);
            if(!req.params.id || req.params.id == 'undefined') return
            let userAd = await User.findById(req.params.id);
            let styles = await Style.find({creator: userAd._id});
            res.render('table', {
                id: req.params.id,
                title: 'Таблица',
                auth: userAd || false,
                style: userAd.tablo_style || 'style_1',
                styles
            });
        }
        catch(e){
            console.log(e);
            res.send('Произошла ошибка');
        }
        }
        
    api = require('./api')
}
    
module.exports = new Constrollers()