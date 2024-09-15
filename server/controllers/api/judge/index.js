const Team = require('../../../models/team-model');
const Judge = require('../../../models/judge-model');

class JudgeController {

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
            if(e.codeName == 'BSONObjectTooLarge') return res.json({message: 'Превышен лимит вводимых данных'});
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async get__edit(req, res) {
        try {
            let judge = await Judge.findOne({_id: req.query.id})
            return sendRes('partials/lk_part/judge_edit', {judge}, res);
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async put__edit(req, res) {
        try {
            const {judgeId} = req.body;
            let judge = await Judge.findOne({_id: judgeId});
            if(!judge) return res.json({message: 'Такого судьи не существует'});
            judge = await Judge.updateOne({_id: judgeId}, req.body);
            return res.json({message: 'Судья обновлен'});
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

module.exports = new JudgeController();
