const {Schema, model} = require('mongoose');

const MatchSchema = new Schema({
    creator: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    fio: {type: String, required: true},
    date: {type: Date},
    team: {type: Schema.Types.ObjectId, ref: 'Team'},
})

//module.exports = model('Match', MatchSchema);
