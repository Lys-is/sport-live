const Team = require('../../../models/team-model');
const Player = require('../../../models/player-model');
const Match = require('../../../models/match-model');
const Tournament = require('../../../models/tournament-model');
const Judge = require('../../../models/judge-model');
const Commentator = require('../../../models/commentator-model');
const team = require('../team');
class MatchController {

    async get__create(req, res) {
        try {
            let teams = await Team.find({creator: req.user.id, status_doc: {$ne: 'deleted'}});
            let tournaments = await Tournament.find({creator: req.user.id, status_doc: {$ne: 'deleted'}});
            let judges = await Judge.find({creator: req.user.id, status_doc: {$ne: 'deleted'}});
            return sendRes('partials/lk_part/match_create', {teams, tournaments, judges}, res);
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async get__create_calendar(req, res) {
        try {
            let teams = await Team.find({creator: req.user.id, status_doc: {$ne: 'deleted'}});
            let tournaments = await Tournament.find({creator: req.user.id, status_doc: {$ne: 'deleted'}});
            return sendRes('partials/lk_part/match_create_calendar', {teams, tournaments}, res);
        } catch (e) {
            console.log(e);
            return res.json({message: 'Произошла ошибка'});
        }
    }
    async post__create_calendar(req, res) {
        
        try {
            let data = req.body;
            data.creator = req.user.id;
            let match_teams = {};
            function pushTeams(t1, t2, circle) {
                let n_circle = match_teams[circle]
                if(!n_circle){
                    match_teams[circle] = [];
                    n_circle = match_teams[circle];
                }
                if(n_circle.includes(`${t1}_${t2}`) || n_circle.includes(`${t2}_${t1}`)) return;
                n_circle.push(`${t1}_${t2}`);
            }



            let tournament = await Tournament.findOne({_id: data.tournamentId});
            if(!tournament) return res.json({message: 'Такого турнира не существует'});
            if(!tournament.creator.equals(req.user.id)) return res.json({message: 'Турнир не принадлежит вам'});
            if(!data.circles) data.circles = 1;

            const teams = [...new Set(tournament.teams.map(t => {return {id: t._id, name:  t.name}}))]
            console.log(teams)
            for(let i = 0; i < data.circles; i++) {
                for(let j = 0; j < teams.length; j++) {
                    for(let k = 0; k < teams.length; k++) {
                        if(k != j)
                            pushTeams(j, k, i);
                    }
                    
                }
            }
            console.log(match_teams)
            let sd
            for(let key in match_teams) {
                sd = await Promise.all(match_teams[key].map(async t => {
                    let [t1, t2] = t.split('_');
                    console.log(t1, t2)
                    let matchData = {
                        creator: req.user.id,
                        team_1: teams[t1].id,
                        team_2: teams[t2].id,
                        tournament: data.tournamentId,
                        date: tournament.basic.date_start || data.date,
                        circle: +key+1
                    }
                    console.log(teams[t1].name, teams[t2].name)
                    let match = await Match.create(matchData);
                    if(!match) return res.json({message: 'Матч не создан, ошибка'});
                    return match;
                }))

            }
            console.log(sd)
            return res.json({message: 'Матчи созданы'});
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
            let teams = await Team.find({creator: req.user.id, status_doc: {$ne: 'deleted'}});
            let tournaments = await Tournament.find({creator: req.user.id, status_doc: {$ne: 'deleted'}});
            let judges = await Judge.find({creator: req.user.id, status_doc: {$ne: 'deleted'}});
            let commentators = await Commentator.find({creator: req.user.id, status_doc: {$ne: 'deleted'}});
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
