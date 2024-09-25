const Team = require('../../../models/team-model');
const Player = require('../../../models/player-model');
const Transfer = require('../../../models/transfer-model');
class RepresentativeController {

    async get__create(req, res) {
        try {
            let teams = await Team.find({creator: req.user.id, status_doc: {$ne: 'deleted'}}).select('name _id');
            let players = await Player.find({creator: req.user.id, status_doc: {$ne: 'deleted'}}).select('fio _id team');
            console.log(teams, players);
            return sendRes('partials/lk_part/transfer_create', {teams, players}, res);
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async post__create(req, res) {
        try {
            let data = req.body;
            data.creator = req.user.id;
            let player = await Player.findOne({_id: data.player});
            if(!player) return res.json({message: 'Такого игрока не существует'});
            let team = await Team.findOne({_id: data.team});
            let teamTo = await Team.findOne({_id: data.team_to});
            if(!team || !teamTo) return res.json({message: 'Такой команды не существует'});
            player.team = data.team_to;
            await player.save();
            let transfer = await Transfer.create(data);
            return res.json({message: 'Трансфер создан', redirect: '/lk?page=transfer'});
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async get__edit(req, res) {
        try {
            let player = await Representative.findOne({_id: req.query.id})
            let teams = await Team.find({creator: req.user.id, status_doc: {$ne: 'deleted'}});
            return sendRes('partials/lk_part/player_edit', {player, teams}, res);
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async put__edit(req, res) {
        try {
            const {playerId} = req.body;
            let player = await Player.findOne({_id: playerId});
            if(!player) return res.json({message: 'Такого игрока не существует'});
            player = await Player.updateOne({_id: playerId}, req.body);
            return res.json({message: 'Игрок обновлен', redirect: `lk?page=transfer`});
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

module.exports = new RepresentativeController();
