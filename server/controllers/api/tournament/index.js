const Team = require('../../../models/team-model');
const Player = require('../../../models/player-model');
const Tournament = require('../../../models/tournament-model');

class TournamentController {

    async get__create(req, res) {
        try {
            return sendRes('partials/lk_part/tour/tournament_create', {}, res);
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async post__create(req, res) {
        try {
            let data = req.body;
            data.creator = req.user.id;
            let tournament = await Tournament.create(data);
            if(!tournament) return res.json({message: 'Команда не создана, ошибка'});
            return res.json({message: 'Команда создана'});
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка: '+ e.message});
        }
    }
    async get__edit(req, res) {
        try {
            let tourId = req.params.id;
            let tournament = await Tournament.findOne({_id: tourId})
            console.log(tournament)
            if(!tournament) return res.json({message: 'Такой команды не существует'});
            console.log(tourId)
            // let players = await Player.find({team: teamId}).populate('team creator');
            // console.log(players)

            return sendRes('partials/lk_part/tour/tournament_edit', {tournament}, res);
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

module.exports = new TournamentController();
