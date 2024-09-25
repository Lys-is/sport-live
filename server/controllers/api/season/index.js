const Team = require('../../../models/team-model');
const Season = require('../../../models/season-model');

class RepresentativeController {

    async get__create(req, res) {
        try {
            return sendRes('partials/lk_part/season_create', {}, res);
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async post__create(req, res) {
        try {
            let data = req.body;
            data.creator = req.user.id;
            let season = await Season.create(data);
            if(!season) return res.json({message: 'Сезон не создан, ошибка'});
            return res.json({message: 'Сезон создан'});
        } catch (e) {
            console.log(e);
            if(e.codeName == 'BSONObjectTooLarge') return res.json({message: 'Превышен лимит вводимых данных'});
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async get__edit(req, res) {
        try {
            let season = await Season.findOne({_id: req.query.id})
            
            return sendRes('partials/lk_part/season_edit', {season}, res);
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async put__edit(req, res) {
        try {
            const {playerId} = req.body;
            let season = await Season.findOne({_id: playerId});
            if(!season) return res.json({message: 'Такого сезона не существует'});
            season = await Season.updateOne({_id: playerId}, req.body);
            return res.json({message: 'Сезон обновлен', redirect: `lk?page=season`});
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
