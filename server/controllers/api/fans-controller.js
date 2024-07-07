const League = require('../../models/league-model');
const User = require('../../models/user-model');
const Tournament = require('../../models/tournament-model');
const Match = require('../../models/match-model');
const Team = require('../../models/team-model');

class FansController {
    async get__tournament(req, res) {
        try {
            const {id} = req.params;
            console.log(req)
            const tournament = await Tournament.findById(id);
            if(!tournament || !tournament.creator.equals(req.fans_league.creator)) {
                return res.json({message: 'Турнир не найден'});
            }
            let matches = await Match.find({tournament: id, status_doc: {$ne: 'deleted'}}).sort({date: 'asc'});
            let futureMatches = await getFutureMatches(matches);
            futureMatches = await getDates(futureMatches);
            console.log(futureMatches)
            return sendRes('fans/fans_tour/tournament', {tournament, futureMatches, compareDates}, res);
        }
        catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
        
    }
    async get__calendar(req, res) {
        try {
            const {id} = req.params;
            console.log(req)
            const tournament = await Tournament.findById(id);
            if(!tournament || !tournament.creator.equals(req.fans_league.creator)) {
                return res.json({message: 'Турнир не найден'});
            }
            let matches = await Match.find({tournament: id, status_doc: {$ne: 'deleted'}}).sort({date: 'asc'});
            matches = await getDates(matches);
            return sendRes('fans/fans_tour/calendar', {tournament, matches, compareDates}, res);
        }
        catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        
        }   
    }
    async get__tables(req, res) {
        try {
            const {id} = req.params;
            console.log(req)
            const tournament = await Tournament.findById(id);
            if(!tournament || !tournament.creator.equals(req.fans_league.creator)) {
                return res.json({message: 'Турнир не найден'});
            }
            let matches = await Match.find({tournament: id, status_doc: {$ne: 'deleted'}}).sort({date: 'asc'});
            let previusMatches = await getPreviousMatches(matches);
            console.log(previusMatches)
            return sendRes('fans/fans_tour/tables', {tournament, previusMatches, compareDates}, res);
        }
        catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        
        }   
    }
    async get__team(req, res) {
        try {
            const {id} = req.params;
            const team = await Team.findById(id);
            if(!team || !team.creator.equals(req.fans_league.creator)) {
                return res.json({message: 'Команда не найдена'});
            }
            let matches = await Match.find({team: id, status_doc: {$ne: 'deleted'}}).sort({date: 'asc'});
            return sendRes('fans/fans_members/team', {team}, res);
        
        }
        catch (e) {
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
async function getFutureMatches(matches) {
    try {
        return futureMatches = matches.filter((item) => {
            console.log(item)
            console.log(new Date(`${item.date} ${item.time || '00:00'}`))
            return true
            return new Date(`${item.date} ${item.time || '00:00'}`) > Date.now() 
        })
    } catch (e) {
        console.error(e);
        return matches
    }
}
async function getPreviousMatches(matches) {
    try {
        return previusMatches = matches.filter((item) => {
            return true
            return new Date(`${item.date} ${item.time || '00:00'}`) < Date.now() 
        })
    } catch (e) {
        console.error(e);
        return matches
    }
}
async function getDates(matches) {
    try {
        return matches.map((item) => {

            let date = new Date(`${item.date} ${item.time || '00:00'}`)
            console.log(date)
            return {...item._doc, format_min: formatDate(date, 'minuts'), format_only_day: formatDate(date, 'only_days')};
        })
    } catch (e) {
        console.error(e);
        return matches
    }
}
let compareDates = (from, to) => { 

    if (!from || !to) {
        return 'Неопределено';
    }
    let dateNow = new Date();
    let dateFrom = new Date(from);
    let dateTo = new Date(to);
    if(dateNow > dateFrom && dateNow < dateTo) {
        return 'Идёт';
    }
    else if(dateNow > dateTo) {
        return 'Завершён';
    }
    else if(dateNow < dateFrom) {
        return 'Не начат';
    }
    return 'Неопределено';
}

function formatDate(date, type) {
    let args = {
        year: "numeric",
        month: "long",
        day: "numeric"
    }
    switch(type){
        case 'days': args = {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
        break;
        case 'only_days': args = {
            month: "long",
            day: "numeric"
        }
        break;
        case 'hours': args = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: 'numeric',
        }
        break;

        case 'minuts': args = {
            month: "long",
            day: "numeric",
            hour: 'numeric',
            minute: '2-digit',
        }
        break;
        case 'full': args = {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: 'numeric',
            minute: '2-digit',
            timeZoneName: "short",

        }
        break;

    }
    let formatter = new Intl.DateTimeFormat("ru", args);

    return formatter.format(date)
}
module.exports = new FansController();
