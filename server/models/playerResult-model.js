const {Schema, model} = require('mongoose');


const PlayerResultSchema = new Schema({
    player: {type: Schema.Types.ObjectId, ref: 'Player', autopopulate: true},
    team: {type: Schema.Types.ObjectId, ref: 'Team', autopopulate: true},
    match: {type: Schema.Types.ObjectId, ref: 'Match', autopopulate: true},
    red: {type: Number, default: 0},
    yellow: {type: Number, default: 0},
    transits: {type: Number, default: 0},
    goals: {type: Number, default: 0},
})

MatchSchema.plugin(require('mongoose-autopopulate'));

module.exports = model('PlayerResult', PlayerResultsSchema);
