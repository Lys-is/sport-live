let Match = require('../models/match-model');
let User = require('../models/user-model');
let League = require('../models/league-model');
const Judge = require('../models/judge-model');
const Commentator = require('../models/commentator-model');
const Subscribe = require('../models/subscribe-model');
const Global = require('../models/global-model');
const UserD = require('../models/userD-model');
let Style = require('../models/style-model');
const Tournament = require('../models/tournament-model');
const Season = require('../models/season-model');
const mongoose = require('mongoose');
const path = require('path');
class Constrollers {
    async auth(req, res, next) {
        res.render('auth', {
            type: 'login',
            title: 'Авторизация',
            auth: req.user || false
        });
    }
    async get__user_agreement(req, res, next) {
        res.render('user_agreement', {
            title: 'Пользовательское соглашение',
            auth: req.user || false
        })

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

        let seasons = await Season.find({creator: req.fans_league.creator._id})
        let tournaments = await Tournament.find({creator: req.fans_league.creator._id, status_doc: {$ne: 'deleted'}})
        tournaments = sortTour(tournaments)
       // await Tournament.updateMany({}, {'status_doc': 'active'})
        res.render('fans/fans_o_lige', {
            league,
            seasons,
            tournaments,
            title: 'О лиге',
            page_title: 'О лиге'
        })
    }
    async get__fans_tournaments(req, res) {
        console.log(req)
        let league = req.fans_league;
        let userAd = await User.findById(league.creator);
        let tournaments = []
        if(req.params.season != 'all'){
            let season = await Season.findOne({_id: req.params.season})
            tournaments = await Tournament.find({creator: req.fans_league.creator._id, 'basic.season': season._id,  status_doc: {$ne: 'deleted'}})
        }
        else  {
            tournaments = await Tournament.find({creator: req.fans_league.creator._id, status_doc: {$ne: 'deleted'}})
        }
        tournaments = sortTour(tournaments)
        let seasons = await Season.find({creator: req.fans_league.creator._id})
        res.render('fans/fans_tournaments', {
            league,
            tournaments,
            seasons,
            title: 'Турниры',
            page_title: 'Турниры',
            compareDates
        })
    }
    async get__fans_members(req, res) {
        let league = req.fans_league
        let userAd = await User.findById(league.creator);
        let seasons = await Season.find({creator: req.fans_league.creator._id})

        let tournaments = await Tournament.find({creator: userAd._id, status_doc: {$ne: 'deleted'}})
        tournaments = sortTour(tournaments)
        res.render('fans/fans_members', {
            league,
            tournaments,
            seasons,
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
        try {
            let uId = req.params.id.split('_')
            let userAd = await User.findById(uId[0]);
            if(!userAd) return res.send('Панель управления. Пользователь не найден');
            let matches = await Match.find({creator: userAd._id, status_doc: {$ne: 'deleted'}})
            matches = await getFutureMatches(matches)
            console.log(matches)
            
            let styles = await Style.find({creator: userAd._id});

            res.render('panel', {
                id: req.params.id,
                title: 'Панель управления ' + (uId[1] || ''),
                auth: userAd || false,
                matches,
                styles
            });
        }
        catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
        
    }
    async get__panel_players(req, res) {
        let uId = req.params.id.split('_')
        let userAd = await User.findById(uId[0]);
        if(!userAd) return res.send('Панель управления. Пользователь не найден');

        let matches = await Match.find({creator: userAd._id, status_doc: {$ne: 'deleted'}})
        let judges = await Judge.find({creator: userAd._id, status_doc: {$ne: 'deleted'}})
        let commentators = await Commentator.find({creator: userAd._id, status_doc: {$ne: 'deleted'}})
        let styles = await Style.find({creator: userAd._id});

        res.render('panel_players', {
            id: req.params.id,
            title: 'Панель управления ' + (uId[1] || ''),
            auth: userAd || false,
            matches,
            styles,
            judges,
            commentators
        });
    }
    async get__inactive(req, res) {
        if(req.user) {
            console.log(req.user);
            let subscribe = await Subscribe.findOne({creator: req.user.id});
            if(subscribe)
                return res.redirect('/lk');
        }
        return res.send('Ваш аккаунт неактивен, пожалуйста, обратитесь к администратору <br> <a href="/login">Страница авторизации</a>');
    }
    async get__table(req, res) {
        try{
            //console.log(req);
            if(!req.params.id || req.params.id == 'undefined') return
            let uId = req.params.id.split('_')
            let userAd = await User.findById(uId[0]);
            if(!userAd) return res.send('Табло. Пользователь не найден');
            let styles = await Style.find({creator: uId[0]});
            res.render('table', {
                id: req.params.id,
                title: 'Табло ' + (uId[1] || ''),
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
    async get__image(req, res) {
        let models = mongoose.modelNames()
        const {model, id} = req.params
        // console.log(model, id, models)
        if(models.includes(model)) {
            let obj = await mongoose.model(model).findById(id).select('img')
            if(obj && obj.img) {
                let mimeType = obj.img.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0];
                const im = obj.img.split(",")[1];
                const img = Buffer.from(im, 'base64');
                res.writeHead(200, {
                   'Content-Type': mimeType,
                   'Content-Length': img.length
                });
                res.end(img); 
            }
            else{
                res.sendFile(path.join(path.dirname(__dirname), '../static/styles/icons/logo.jpg'))
            }
        }
        else
            res.sendFile(path.join(path.dirname(__dirname), '../static/styles/icons/logo.jpg'))
    }
    api = require('./api')
}
    
const sortTour = (tournaments) => {
    tournaments = tournaments.map((tour)=>{
        tour.date_start_format = new Date(tour.basic.date_start || 0)
        return tour
    })
    tournaments = tournaments.sort((a, b) => {return b.date_start_format - a.date_start_format})
    console.log(tournaments)
    return tournaments
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
async function getFutureMatches(matches) {
    try {
        return futureMatches = matches.filter((item) => {
            //return true
            return new Date(`${item.date} 23:59`) > Date.now() 
        })
    } catch (e) {
        console.error(e);
        return matches
    }
}
module.exports = new Constrollers()