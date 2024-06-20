const {Schema, model} = require('mongoose');

const StageSchema = new Schema({
    tournament: {type: Schema.Types.ObjectId, ref: 'Tournament', autopopulate: true, required: true},
    name: {type: String, required: true},
    type: {type: String, default: ''},
    for_place: {type: String, required: true},
    rank: {type: String, required: true},
})
StageSchema.plugin(require('mongoose-autopopulate'));

module.exports = model('Stage', StageSchema);
