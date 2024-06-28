const Team = require('../../../models/team-model');
const Player = require('../../../models/player-model');
const Match = require('../../../models/match-model');
const Tournament = require('../../../models/tournament-model');
class MatchController {

    async get__create(req, res) {
        try {
            let teams = await Team.find();
            let tournaments = await Tournament.find();
            return sendRes('partials/lk_part/match_create', {teams, tournaments}, res);
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async post__create(req, res) {
        try {
            let {team_1, team_2, date} = req.body;
            await Match.create({team_1, team_2, date, creator: req.user.id});
            return res.json({message: 'Матч создан'});
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async get__team_list(req, res) {
        try {
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
    
}
async function sendRes(path, data, res) {
    return res.render(path, data,
    function(err, html) {
        if(err) console.log(err);
        res.json(html);
    });
}

module.exports = new MatchController();
