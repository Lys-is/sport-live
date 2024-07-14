let Match = require('../models/match-model');
let User = require('../models/user-model');
let League = require('../models/league-model');
const Global = require('../models/global-model');
const UserD = require('../models/userD-model');
let Style = require('../models/style-model');
const Tournament = require('../models/tournament-model');

class Constrollers {
    async auth(req, res, next) {
        res.render('auth', {
            type: 'login',
            title: 'Авторизация',
            auth: req.user || false
        });
    }
    async get__reset_password(req, res, next) {
        res.render('auth', {
            type: 'reset_password',
            title: 'Восстановление пароля',
            auth: req.user || false
        });
    }
    async get__new_password(req, res) {
        try {
            res.render('auth', {
                type: 'new_password',
                title: 'Авторизация',
                auth: req.user || false
            });
        } catch (e) {
            return res.json({message: 'Произошла ошибка + ' + e.message});
        }
    }
    async lk(req, res, next) {
        try {

            let league = await League.findOne({creator: req.user.id});
            let profile = await UserD.findOne({creator: req.user.id});
            let site_img = await Global.findOne({name: 'site_img'});
            let site_name = await Global.findOne({name: 'site_name'});
            res.render('lk', {
                title: 'ЛК',
                league: league || false,
                auth: req.user || false,
                isAdmin: req.user.isAdmin,
                site_img: site_img ? site_img.data : '/static/styles/icons/logo.jpg',
                site_name: site_name ? site_name.data : 'Sporlive',
            });
        } catch (e) {
            return res.json({message: 'Произошла ошибка + ' + e.message});
        }
    }
    async get__login(req, res, next) {
        try {
            res.render('auth', {
                type: 'login',
                title: 'Авторизация',
                auth: req.user || false
            });
        } catch (e) {
            return res.json({message: 'Произошла ошибка + ' + e.message});
        }
    }
    async get__fans(req, res) {
        let league = req.fans_league
       // await Tournament.updateMany({}, {'status_doc': 'active'})
        res.render('fans/fans_o_lige', {
            league,
            title: 'О лиге',
            page_title: 'О лиге'
        })
    }
    async get__fans_tournaments(req, res) {
        let league = req.fans_league;
        let userAd = await User.findById(league.creator);
        let tournaments = await Tournament.find({creator: req.fans_league.creator._id, status_doc: {$ne: 'deleted'}})

        res.render('fans/fans_tournaments', {
            league,
            tournaments,
            title: 'Турниры',
            page_title: 'Турниры',
            compareDates
        })
    }
    async get__fans_members(req, res) {
        let league = req.fans_league
        let userAd = await User.findById(league.creator);
        let tournaments = await Tournament.find({creator: userAd._id, status_doc: {$ne: 'deleted'}})
        res.render('fans/fans_members', {
            league,
            tournaments,
            title: 'Участники',
            page_title: 'Участники'
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
        let matches = await Match.find({creator: req.params.id, status_doc: {$ne: 'deleted'}})
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
    async get__panel_players(req, res) {
        let matches = await Match.find({creator: req.params.id, status_doc: {$ne: 'deleted'}})
        let userAd = await User.findById(req.params.id);
        let styles = await Style.find({creator: userAd._id});

        res.render('panel_players', {
            id: req.params.id,
            title: 'Панель управления',
            auth: userAd || false,
            matches,
            styles
        });
    }
    async get__inactive(req, res) {
        return res.send('Ваш аккаунт неактивен, пожалуйста, обратитесь к администратору');
    }
    async get__table(req, res) {
        try{
            //console.log(req);
            if(!req.params.id || req.params.id == 'undefined') return
            let userAd = await User.findById(req.params.id);
            let styles = await Style.find({creator: userAd._id});
            res.render('table', {
                id: req.params.id,
                title: 'Табло',
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
    


let compareDates = (from, to) => { 

    if (!from || !to) {
        return 'Неопределено';
    }
    let dateNow = new Date();
    let dateFrom = new Date(from);
    let dateTo = new Date(to);
    if(dateNow > dateFrom && dateNow < dateTo) {
        return 'Идёт';
    }
    else if(dateNow > dateTo) {
        return 'Завершён';
    }
    else if(dateNow < dateFrom) {
        return 'Не начат';
    }
    return 'Неопределено';
}
module.exports = new Constrollers()