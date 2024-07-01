const {Schema, model, overwriteMiddlewareResult} = require('mongoose');
const Player = require('./player-model');
const PlayerResultsSchema = new Schema({
    player: {type: Schema.Types.ObjectId, ref: 'Player', autopopulate: true},
    match: {type: Schema.Types.ObjectId, ref: 'Match', autopopulate: true},
    red: {type: Number, default: 0},
    yellow: {type: Number, default: 0},
    transits: {type: Number, default: 0},
    goals: {type: Number, default: 0},
})
const MatchSchema = new Schema({
    creator: {type: Schema.Types.ObjectId, ref: 'User', required: true, autopopulate: true},
    date: {type: String, required: true},
    time: {type: String, required: true},
    is_overtime: {type: Boolean, default: false},
    is_penalty: {type: Boolean, default: false},
    is_tech_win: {type: Boolean, default: false},
    team_1: {type: Schema.Types.ObjectId, ref: 'Team', required: true, autopopulate: true},
    team_2: {type: Schema.Types.ObjectId, ref: 'Team', required: true, autopopulate: true},
    tournament: {type: Schema.Types.ObjectId, ref: 'Tournament', autopopulate: true},
    team_1_score: {type: Number, default: 0},
    team_2_score: {type: Number, default: 0},
    status: {type: String, default: 'Не начат'},
    judges: [{type: Schema.Types.ObjectId, ref: 'Judge', autopopulate: true}],
    results_1: [PlayerResultsSchema],
    results_2: [PlayerResultsSchema],
})
MatchSchema.methods.setPlayerResults = async function(results) {
    if(results){
        this.results_1.forEach((el, i) => {
            console.log(el, results.team_1[i])
            for(let key in results.team_1[i]) {
                el[key] = results.team_1[i][key]
            }
        })
        this.results_2.forEach((el, i) => {
            for(let key in results.team_2[i]) {
                el[key] = results.team_2[i][key]
            }
        })
        console.log(this.results_1)
        console.log(this.results_2)
    }
    else{
        let players = await Player.find({team: this.team_1})

        for(let player of players) {
            this.results_1.push({
                player: player._id
            })
        }

        players = await Player.find({team: this.team_2})
        for(let player of players) {
            this.results_2.push({
                player: player._id
            })
        }   
    }
    this.save()
}
PlayerResultsSchema.plugin(require('mongoose-autopopulate'));
MatchSchema.plugin(require('mongoose-autopopulate'));

module.exports = model('Match', MatchSchema);
