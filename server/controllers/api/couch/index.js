const Team = require('../../../models/team-model');
const Couch = require('../../../models/couch-model');

class RepresentativeController {

    async get__create(req, res) {
        try {
            let teams = await Team.find({creator: req.user.id, status_doc: {$ne: 'deleted'}});
            return sendRes('partials/lk_part/couch_create', {teams}, res);
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async post__create(req, res) {
        try {
            let data = req.body;
            data.creator = req.user.id;
            let team = await Team.findOne({_id: data.team});
            if(!team) return res.json({message: 'Такой команды не существует'});
            let couch = await Couch.create(data);
            if(!couch) return res.json({message: 'Тренер не создан, ошибка'});
            return res.json({message: 'Тренер создан'});
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async get__edit(req, res) {
        try {
            let couch = await Couch.findOne({_id: req.query.id})
            let teams = await Team.find({creator: req.user.id, status_doc: {$ne: 'deleted'}});
            return sendRes('partials/lk_part/couch_edit', {couch, teams}, res);
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async put__edit(req, res) {
        try {
            const {couchId} = req.body;
            let couch = await Couch.findOne({_id: couchId});
            if(!couch) return res.json({message: 'Такого тренера не существует'});
            couch = await Couch.updateOne({_id: couchId}, req.body);
            return res.json({message: 'Тренер обновлен', redirect: `lk?page=couch`});
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
