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
    player = require('./player')
    tournament = require('./tournament')
    match = require('./match')
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
    async get__judge(req, res) {
        try {
            console.log(req);
            console.log(await Judge.find());
            let judges = await Judge.find({})
            judges = judges.map((judge) => {
                judge.date = judge.date.toLocaleDateString()
                console.log(judge.date);
                return judge
            })
            return sendRes('partials/lk_part/judge', {judges}, res);
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async get__representative(req, res) {
        try {
            console.log(await Representative.find());
            let representatives = await Representative.find({})
            representatives = representatives.map((representative) => {
                representative.date = representative.date.toLocaleDateString()
                console.log(representative.date);
                return representative
            })
            return sendRes('partials/lk_part/representative', {representatives}, res);
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async get__season(req, res) {
        try {
            console.log(req);
            console.log(await Season.find());
            let seasons = await Season.find({})
            seasons = seasons.map((season) => {
                season.date = season.date.toLocaleDateString()
                console.log(season.date);
                return season
            })
            return sendRes('partials/lk_part/season', {seasons}, res);
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async get__stadium(req, res) {
        try {
            console.log(req);
            console.log(await Stadium.find());
            let stadiums = await Stadium.find({})
            stadiums = stadiums.map((stadium) => {
                stadium.date = stadium.date.toLocaleDateString()
                console.log(stadium.date);
                return stadium
            })
            return sendRes('partials/lk_part/stadium', {stadiums}, res);
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async get__transfer(req, res) {
        try {
            console.log(req);
            console.log(await Transfer.find());
            let transfers = await Transfer.find({})
            transfers = transfers.map((transfer) => {
                transfer.date = transfer.date.toLocaleDateString()
                console.log(transfer.date);
                return transfer
            })
            return sendRes('partials/lk_part/transfer', {transfers}, res);
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async get__player(req, res) {
        try {
            console.log(req);
            console.log(await Player.find());
            let players = await Player.find({}).populate('creator team');
            players = players.map((player) => {
                player.date = player.date.toLocaleDateString()
                console.log(player.date);
                return player
            })
            return sendRes('partials/lk_part/player', {players}, res);
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async get__team(req, res) {
        try {
            console.log(req);
            console.log(await Team.find());
            let teams = await Team.find({}).populate('creator');
            teams = teams.map((team) => {
                console.log(team.date);
                return team
            })
            return sendRes('partials/lk_part/team', {teams}, res);
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async get__tournament(req, res) {
        try {
            console.log(req);
            console.log(await Tournament.find());
            let tournaments = await Tournament.find({creator: req.user.id}).populate('creator');
            tournaments = tournaments.map((tournament) => {
                // tournament.date_start = tournament.date_start.toLocaleDateString()
                // tournament.date_end = tournament.date_end.toLocaleDateString()
                //console.log(tournament.date);
                return tournament
            })
            return sendRes('partials/lk_part/tournament', {tournaments}, res);
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async get__match(req, res) {
        try {
            console.log(req);
            console.log(await Match.find({creator: req.user.id}));
            let matches = await Match.find({creator: req.user.id}).populate('team_1 team_2');
            matches = matches.map((match) => {
                match.date = match.date.toLocaleDateString()
                console.log(match.date);
                return match
            })
            console.log(matches);
            return sendRes('partials/lk_part/match', {matches}, res);
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
