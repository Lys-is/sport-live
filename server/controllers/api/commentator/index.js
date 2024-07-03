const Team = require('../../../models/team-model');
const Commentator = require('../../../models/commentator-model');

class CommentatorController {

    async get__create(req, res) {
        try {
            return sendRes('partials/lk_part/commentator_create', {}, res);
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async post__create(req, res) {
        try {
            let data = req.body;
            data.creator = req.user.id;
            let commentator = await Commentator.create(data);
            if(!commentator) return res.json({message: 'Комментатор не создан, ошибка'});
            return res.json({message: 'Комментатор создан'});
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async get__edit(req, res) {
        try {
            let player = await Representative.findOne({_id: req.query.id})
            let teams = await Team.find();
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

module.exports = new CommentatorController();
