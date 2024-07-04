const {Schema, model} = require('mongoose');

const TransferSchema = new Schema({
    creator: {type: Schema.Types.ObjectId, ref: 'User', required: true, autopopulate: true},
    team_from: {type: Schema.Types.ObjectId, ref: 'Team', autopopulate: true, required: true},
    team_to: {type: Schema.Types.ObjectId, ref: 'Team', autopopulate: true, required: true},
    player: {type: Schema.Types.ObjectId, ref: 'Player', autopopulate: true, required: true},
    date: {type: String, required: true},
})
TransferSchema.plugin(require('mongoose-autopopulate'));
module.exports = model('Transfer', TransferSchema);
