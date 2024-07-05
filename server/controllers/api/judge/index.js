const Team = require('../../../models/team-model');
const Judge = require('../../../models/judge-model');

class RepresentativeController {

    async get__create(req, res) {
        try {
            return sendRes('partials/lk_part/judge_create', {}, res);
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async post__create(req, res) {
        try {
            let data = req.body;
            data.creator = req.user.id;
            let judge = await Judge.create(data);
            if(!judge) return res.json({message: 'Судья не создан, ошибка'});
            return res.json({message: 'Судья создан'});
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
            return res.json({message: 'Игрок обновлен'});
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
