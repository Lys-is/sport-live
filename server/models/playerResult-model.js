const {Schema, model} = require('mongoose');
const player = require('../controllers/api/player');


const PlayerResultSchema = new Schema({
    creator: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    is_active: {type: Boolean, default: true},
    player: {type: Schema.Types.ObjectId, ref: 'Player', autopopulate: true},
    player_fio: {type: String},
    team: {type: Schema.Types.ObjectId, ref: 'Team'},
    match: {type: Schema.Types.ObjectId, ref: 'Match'},
    red: {type: Number, default: 0},
    yellow: {type: Number, default: 0},
    transits: {type: Number, default: 0},
    goals: {type: Number, default: 0},
})
PlayerResultSchema.plugin(require('mongoose-autopopulate'));

module.exports = model('PlayerResult', PlayerResultSchema);
