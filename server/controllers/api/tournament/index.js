const Team = require('../../../models/team-model');
const Player = require('../../../models/player-model');
const Tournament = require('../../../models/tournament-model');
const editController = require('./edit-controller');
const groupController = require('./group-controller');
class TournamentController {
    put__edit = editController
    group = groupController
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
            let data = {};
            data.creator = req.user.id;
            data.basic = req.body;
            let tournament = await Tournament.create(data);
            if(!tournament) return res.json({message: 'Команда не создана, ошибка'});
            return res.json({message: 'Турнир создан'});
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка: '+ e.message});
        }
    }
    async get__template(req, res) {
        try {
            let tourId = req.params.id;
            console.log(tourId)
            let tournament = await Tournament.findOne({_id: tourId})
            console.log(tournament)
            if(!tournament) return res.json({message: 'Такой команды не существует'});
            return sendRes('partials/lk_part/tour/tournament_template', {tournament}, res);
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async put__team(req, res) {
        try {
            let tourId = req.body.tournamentId;
            console.log(tourId)
            let tournament = await Tournament.findOne({_id: tourId})
            console.log(tournament)
            if(!tournament) return res.json({message: 'Такого турнира не существует'});
            let team = await Team.findOne({_id: req.body.teamId});
            if(!team) return res.json({message: 'Такой команды не существует'});
            tournament.teams.push(req.body.teamId);
            await tournament.save();
            return res.json({message: 'Обновлено'});
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
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
    async get__group(req, res) {
        try {
            let tourId = req.params.id;
            let tournament = await Tournament.findOne({_id: tourId})
            let groups = await tournament.getGroups();
            console.log(groups)
            return sendRes('partials/lk_part/tour/tournament_group', {tournament, groups}, res);
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }   
    }
    async get__group_create(req, res) {
        try {
            return sendRes('partials/lk_part/tour/tournament_group_create', {}, res);
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async get__group_edit(req, res) {
        try {
            return sendRes('partials/lk_part/tour/tournament_group_edit', {}, res);
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async get__judge(req, res) {
        try {
            return sendRes('partials/lk_part/tour/tournament_judge', {}, res);
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async get__docs(req, res) {
        try {
            return sendRes('partials/lk_part/tour/tournament_docs', {}, res);
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async get__team(req, res) {
        try {
            let tourId = req.params.id;
            let tournament = await Tournament.findOne({_id: tourId})
            let chooseTeams = tournament.teams;
            console.log(chooseTeams)
            let teams = await Team.find( { $nor: [{_id: {$in: chooseTeams}}] });

            return sendRes('partials/lk_part/tour/tournament_teams', {teams}, res);
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
