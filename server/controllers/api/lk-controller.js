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
User = require('../../models/user-model'),
League = require('../../models/league-model'),
Style = require('../../models/style-model'),
Commentator = require('../../models/commentator-model'),
Couch = require('../../models/couch-model');
const dbService = require('../../service/db-service');
class LkController {

    team = require('./team')
    player = require('./player')
    tournament = require('./tournament')
    match = require('./match')
    representative = require('./representative')
    judge = require('./judge')
    couch = require('./couch')
    commentator = require('./commentator')
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
            let judges = await dbService.getAggregate(Judge, req);
            let total = await Judge.countDocuments({});
            return sendRes('partials/lk_part/judge', {judges, total}, res);
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async get__commentator(req, res) {
        try {
            console.log(req);
            let commentators = await dbService.getAggregate(Commentator, req);
            let total = await Commentator.countDocuments({});
            return sendRes('partials/lk_part/commentator', {commentators, total}, res);
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async get__representative(req, res) {
        try {
            console.log(await Representative.find());
            let teams = await Team.find({}).select('name _id');
            let representatives = await dbService.getAggregate(Representative, req);
            let total = await Representative.countDocuments({});
            return sendRes('partials/lk_part/representative', {representatives, teams, total}, res);
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async get__couch(req, res) {
        try {
            let teams = await Team.find({}).select('name _id');
            let couches = await dbService.getAggregate(Couch, req);
            let total = await Couch.countDocuments({});
            return sendRes('partials/lk_part/couch', {couches, teams, total}, res);
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
    async get__league(req, res) {
        try {
            let league = await League.findOne({creator: req.user.id});
            if(!league)
                league = await League.create({creator: req.user.id, name: req.user.name, address: req.user._id});
            return sendRes('partials/lk_part/league', {league}, res);
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async put__league(req, res) {
        try {
            await League.findOneAndUpdate({creator: req.user.id}, req.body);
            return res.json({message: 'Лига обновлена'});
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async get__player(req, res) {
        try {
            console.log(req);
            console.log(await Player.find());
            let teams = await Team.find().select('name _id');
            let players = await dbService.getAggregate(Player, req);
            let total = await Player.countDocuments({}) ;

            return sendRes('partials/lk_part/player', {players, teams, total}, res);
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async get__team(req, res) {
        try {

            // let teams = await Team.find({})
            // teams = teams.map((team) => {
            //     console.log(team.date);
            //     return team
            // })
            let teams = await dbService.getAggregate(Team, req);
            let total = await Team.countDocuments({});
            return sendRes('partials/lk_part/team', {teams, total}, res);
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async get__tournament(req, res) {
        try {
            req.query['creator'] = req.user.id
            console.log(req);

            let tournaments = await dbService.getAggregate(Tournament, req);
            let total = await Tournament.countDocuments({creator: req.user.id});
            return sendRes('partials/lk_part/tournament', {tournaments, total}, res);
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async get__match(req, res) {
        try {
            console.log(req);
            let tournaments = await Tournament.find({creator: req.user.id}).select('basic.name _id');
            let teams = await Team.find().select('name _id');
            req.query['creator'] = req.user.id
            let matches = await dbService.getAggregate(Match, req);
            let total = await Match.countDocuments({creator: req.user.id});
            console.log(matches, total);
            return sendRes('partials/lk_part/match', {matches, tournaments, teams, total}, res);
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

            return sendRes('partials/lk_part/profile', {user: req.user, profile: profile}, res);
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
            await User.updateOne({_id: req.user.id}, data);
            await UserD.updateOne({creator: req.user.id}, data);
            return res.json({message: 'Профиль обновлен'});
        }
        catch(e){
            console.log(e);
            res.json({message: 'Произошла ошибка'});
        }
    }
    async get__style(req, res) {
        try {
            let styles = await Style.find({creator: req.user.id});
            return sendRes('partials/lk_part/style', {styles}, res);
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async post__style(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {...data} = req.body;
            console.log(data);
            if(data.style_id && !data.style_name_new){
                let style = await Style.findById(data.style_id);
                if(!style)
                    return res.json({message: 'Такого стиля нет'});
                style = await Style.findByIdAndUpdate(data.style_id, data);
                return res.json({message: 'Стиль обновлен', style});
            }
            if(data.style_name_new){
                let style = await Style.create({...data, name: data.style_name_new ,  creator: req.user.id});
                return res.json({message: 'Стиль создан', style});
            }
            return res.json({message: 'Стиль создан'});
        }
        catch(e){
            console.log(e);
            res.json({message: 'Произошла ошибка'});
        }
    }
    async get__style_by_id(req, res) {
        try {
            let style = await Style.findById(req.query.id);
            return res.json({style});
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
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
