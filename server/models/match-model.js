const {Schema, model} = require('mongoose');

const MatchSchema = new Schema({
    creator: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    date: {type: Date},
    team_1: {type: Schema.Types.ObjectId, ref: 'Team', required: true},
    team_2: {type: Schema.Types.ObjectId, ref: 'Team', required: true},
    stadium: {type: Schema.Types.ObjectId, ref: 'Stadium'},
    tournament: {type: Schema.Types.ObjectId, ref: 'Tournament'},
})

module.exports = model('Match', MatchSchema);
