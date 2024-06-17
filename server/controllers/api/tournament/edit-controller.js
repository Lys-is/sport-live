const Tournament = require('../../../models/tournament-model');

class EditController {
    async put__basic(req, res) {
        try {
            let data = req.body;
            let tourId = data.tournamentId;
            console.log(data);
            let tournament = await Tournament.findOne({_id: tourId});
            if(!tournament) return res.json({message: 'Не найден турнир, ошибка'});
            tournament.basic = data;
            await tournament.save();
            return res.json({message: 'Обновлено'});
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }

    async put__reglament(req, res) {
        try {
            let data = req.body;
            let tourId = data.tournamentId;
            console.log(data);
            let tournament = await Tournament.findOne({_id: tourId});
            if(!tournament) return res.json({message: 'Не найден турнир, ошибка'});
            tournament.reglament = data;
            await tournament.save();
            return res.json({message: 'Обновлено'});
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }

    async put__application_campaign(req, res) {
        try {
            let data = req.body;
            let tourId = data.tournamentId;
            console.log(data);
            let tournament = await Tournament.findOne({_id: tourId});
            if(!tournament) return res.json({message: 'Не найден турнир, ошибка'});
            tournament.application_campaign = data;
            await tournament.save();
            return res.json({message: 'Обновлено'});
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }

    async put__visual(req, res) {
        try {
            let data = req.body;
            let tourId = data.tournamentId;
            console.log(data);
            let tournament = await Tournament.findOne({_id: tourId});
            if(!tournament) return res.json({message: 'Не найден турнир, ошибка'});
            tournament.visual = data;
            await tournament.save();
            return res.json({message: 'Обновлено'});
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }

    async put__tags(req, res) {
        try {
            let data = req.body;
            let tourId = data.tournamentId;
            console.log(data);
            let tournament = await Tournament.findOne({_id: tourId});
            if(!tournament) return res.json({message: 'Не найден турнир, ошибка'});
            tournament.tags = data;
            await tournament.save();
            return res.json({message: 'Обновлено'});
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }

   
}

module.exports = new EditController();