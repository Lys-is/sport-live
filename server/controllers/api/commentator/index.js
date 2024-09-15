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
            let commentator = await Commentator.findOne({_id: req.query.id})
            let teams = await Team.find({creator: req.user.id, status_doc: {$ne: 'deleted'}});
            return sendRes('partials/lk_part/commentator_edit', {commentator, teams}, res);
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async put__edit(req, res) {
        try {
            const {commentatorId} = req.body;
            let commentator = await Commentator.findOne({_id: commentatorId});
            if(!commentator) return res.json({message: 'Такого комментатора не существует'});
            commentator = await Commentator.updateOne({_id: commentatorId}, req.body);
            return res.json({message: 'Комментатор обновлен'});
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
