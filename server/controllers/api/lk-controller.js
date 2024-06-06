const userService = require('../../service/user-service');
const {validationResult} = require('express-validator');
const ApiError = require('../../exceptions/api-error');
const UserD = require('../../models/userD-model'),
Judge = require('../../models/judge-model'),
Match = require('../../models/match-model'),
Player = require('../../models/player-model'),
Representative = require('../../models/representative-model'),
Season = require('../../models/season-model'),
Stadium = require('../../models/stadium-model'),
Team = require('../../models/team-model'),
Tournament = require('../../models/tournament-model'),
Transfer = require('../../models/transfer-model'),
User = require('../../models/user-model');


class LkController {

    team = require('./team')
    async get__create(req, res) {
        try {
            return sendRes('partials/lk_part/team_create', {}, res);
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async post__create(req, res) {
        try {
            let {name, description} = req.body;
            await Team.create({creator: req.user.id, admins: req.user.id, name, description});
            return res.json({message: 'Команда создана'});
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async get__team(req, res) {
        try {
            console.log(req);
            console.log(await Team.find());
            let teams = await Team.find({creator: req.user.id}).populate('creator');
            teams = teams.map((team) => {
                team.date = team.date.toLocaleDateString()
                console.log(team.date);
                return team
            })
            return sendRes('partials/lk_part/team', {teams}, res);
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async get__profile(req, res) {
        try {
            console.log(req.user);
            let profile = await UserD.findOne({creator: req.user.id});
            console.log(profile);
            if(!profile)
                profile = await UserD.create({creator: req.user.id});
            console.log(profile);

            return sendRes('partials/lk_part/profile', {user: profile}, res);
        } catch (e) {
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async put__profile(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {...data} = req.body;
            console.log(data);
            await UserD.updateOne({creator: req.user.id}, data);
            return res.json({message: 'Профиль обновлен'});
        }
        catch(e){
            console.log(e);
            res.json({message: 'Произошла ошибка'});
        }
    }


    
    
}

async function sendRes(path, data, res) {
    return res.render(path, data,
    function(err, html) {
        if(err) console.log(err);
        res.json(html);
    });
}

function formatDate(date, type) {
    let args = {
        year: "numeric",
        month: "long",
        day: "numeric"
    }
    switch(type){
        case 'days': args = {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
        break;
        case 'hours': args = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: 'numeric',
        }
        break;

        case 'minuts': args = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: 'numeric',
            minute: '2-digit',
        }
        break;
        case 'full': args = {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: 'numeric',
            minute: '2-digit',
            timeZoneName: "short",

        }
        break;

    }
    let formatter = new Intl.DateTimeFormat("ru", args);

    return formatter.format(date)
}

module.exports = new LkController();
