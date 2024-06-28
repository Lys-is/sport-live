const {Schema, model} = require('mongoose');

const MatchSchema = new Schema({
    creator: {type: Schema.Types.ObjectId, ref: 'User', required: true, autopopulate: true},
    date: {type: String, required: true},
    team_1: {type: Schema.Types.ObjectId, ref: 'Team', required: true, autopopulate: true},
    team_2: {type: Schema.Types.ObjectId, ref: 'Team', required: true, autopopulate: true},
    stadium: {type: Schema.Types.ObjectId, ref: 'Stadium', autopopulate: true},
    tournament: {type: Schema.Types.ObjectId, ref: 'Tournament', autopopulate: true},
    team_1_score: {type: Number, default: 0},
    team_2_score: {type: Number, default: 0},
    status: {type: String, default: 'Не начат'},
    judges: [{type: Schema.Types.ObjectId, ref: 'Judge', autopopulate: true}],
})
const PlayerResultsSchema = new Schema({
    player: {type: Schema.Types.ObjectId, ref: 'Player', autopopulate: true},
    match: {type: Schema.Types.ObjectId, ref: 'Match', autopopulate: true},
    red: {type: Number, default: 0},
    yellow: {type: Number, default: 0},
    transits: {type: Number, default: 0},
    goals: {type: Number, default: 0},
})

MatchSchema.plugin(require('mongoose-autopopulate'));

module.exports = model('Match', MatchSchema);
