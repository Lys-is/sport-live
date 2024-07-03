const Team = require('../../../models/team-model');
const Player = require('../../../models/player-model');
const Match = require('../../../models/match-model');
const Tournament = require('../../../models/tournament-model');
const Judge = require('../../../models/judge-model');
const Commentator = require('../../../models/commentator-model');
class MatchController {

    async get__create(req, res) {
        try {
            let teams = await Team.find();
            let tournaments = await Tournament.find();
            let judges = await Judge.find();
            return sendRes('partials/lk_part/match_create', {teams, tournaments, judges}, res);
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async post__create(req, res) {
        try {
            let data = req.body;
            data.creator = req.user.id;
            let match = await Match.create(data);
            await match.setPlayerResults();
            if(!match) return res.json({message: 'Матч не создан, ошибка'});
            return res.json({message: 'Матч создан'});
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async get__edit(req, res) {
        try {
            let matchId = req.params.id;
            let match = await Match.findOne({_id: matchId})
            console.log(match)
            if(!match) return res.json({message: 'Такого матча не существует'});
            if(!match.results_1 || !match.results_2) 
                await match.setPlayerResults();
            console.log(matchId)
            let teams = await Team.find();
            let tournaments = await Tournament.find();
            let judges = await Judge.find();
            let commentators = await Commentator.find();
            return sendRes('partials/lk_part/match_edit', {match, teams, tournaments, judges, commentators}, res);
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async put__edit(req, res) {
        try {
            let matchId = req.body.matchId;
            let match = await Match.findOne({_id: matchId})
            console.log(match)
            if(!match) return res.json({message: 'Такого матча не существует'});
            console.log(matchId)
            await Match.updateOne({_id: matchId}, req.body);
            console.log(req.body)
            return res.json({message: 'Матч обновлен'});
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async put__results(req, res) {
        try {
            let matchId = req.body.matchId;
            let match = await Match.findOne({_id: matchId})
            console.log(match)
            if(!match) return res.json({message: 'Такого матча не существует'});
            console.log(matchId)
            await match.setPlayerResults(req.body);
            return res.status(200).end();
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async get__team_list(req, res) {
        try {
            let teamId = req.query.id;
            let team = await Team.findOne({_id: teamId})
            console.log(team)
            if(!team) return res.json({message: 'Такой команды не существует'});
            console.log(teamId)
            let players = await Player.find({team: teamId}).populate('team creator');
            console.log(players)

            return sendRes('partials/lk_part/team_list', {players: players, team: team}, res);
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }

    async put__judge(req, res) {
        try {
            let matchId = req.body.matchId;
            let match = await Match.findOne({_id: matchId})
            console.log(match)
            if(!match) return res.json({message: 'Такого матча не существует'});
            console.log(matchId)
            let result = await Match.updateOne({_id: matchId}, {$addToSet: {judges: req.body.judgeId}});
            console.log(result)
            if(!result || !result.modifiedCount) return res.json({message: 'Судья не добавлен'});
            return res.json({message: 'Судья добавлен'});
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async put__commentator(req, res) {
        try {
            let matchId = req.body.matchId;
            let match = await Match.findOne({_id: matchId})
            console.log(match)
            if(!match) return res.json({message: 'Такого матча не существует'});
            console.log(matchId)
            let result = await Match.updateOne({_id: matchId}, {$addToSet: {commentators: req.body.commentatorId}});
            console.log(result)
            if(!result || !result.modifiedCount) return res.json({message: 'Комментатор не добавлен'});
            return res.json({message: 'Комментатор добавлен'});
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

module.exports = new MatchController();
