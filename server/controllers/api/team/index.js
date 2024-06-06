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
            await Team.create({creator: req.user.id, admins: req.user.id, name, description});
            return res.json({message: 'Команда создана'});
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async get__team_list(req, res) {
        try {
            let teamId = req.params.id;
            let team = await Team.findOne({_id: teamId})
            console.log(team)
            if(!team) return res.json({message: 'Такой команды не существует'});
            let players = Player.find({team: teamId})
            console.log(players)

            return sendRes('partials/lk_part/team_list', {players}, res);
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
