const Team = require('../../../models/team-model');
const Player = require('../../../models/player-model');

class TeamsController {

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
            await Team.create({creator: req.user.id, admins: req.user.id, ...req.body});
            return res.json({message: 'Команда создана'});
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async get__team_list(req, res) {
        try {
            console.log(req.query)
            let teamId = req.query.id;
            let team = await Team.findOne({_id: teamId})
            console.log(team)
            if(!team) return res.json({message: 'Такой команды не существует'});
            console.log(teamId)
            let players = await Player.find({team: teamId}).populate('team creator');
            console.log(players)

            return sendRes('partials/lk_part/team_list', {players: players, team: team}, res);
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async get__team_list_create(req, res) {
        try {
            return sendRes('partials/lk_part/team_list_create', {}, res);
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async post__team_list_create(req, res) {
        try {
            let {fio, date, teamId} = req.body;
            let team = await Team.findOne({_id: teamId});
            if(!team) return res.json({message: 'Такой команды не существует'});
            let player = await Player.create({fio, date, team: teamId, creator: req.user.id});
            console.log(player);
            return res.json({message: 'Игрок создан'});
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

module.exports = new TeamsController();
