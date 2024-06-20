const {Schema, model} = require('mongoose');

const MatchSchema = new Schema({
    creator: {type: Schema.Types.ObjectId, ref: 'User', required: true, autopopulate: true},
    date: {type: String, required: true},
    team_1: {type: Schema.Types.ObjectId, ref: 'Team', required: true, autopopulate: true},
    team_2: {type: Schema.Types.ObjectId, ref: 'Team', required: true, autopopulate: true},
    stadium: {type: Schema.Types.ObjectId, ref: 'Stadium', autopopulate: true},
    tournament: {type: Schema.Types.ObjectId, ref: 'Tournament', autopopulate: true},
})
MatchSchema.plugin(require('mongoose-autopopulate'));

module.exports = model('Match', MatchSchema);
