const {Schema, model} = require('mongoose');

const TeamSchema = new Schema({
    creator: {type: Schema.Types.ObjectId, ref: 'User', required: true, autopopulate: true},
    name: {type: String, required: true},
    description: {type: String, default: ''},
    date: {type: Date, default: () => Date.now()},
    admins: [{type: Schema.Types.ObjectId, ref: 'User', required: true, autopopulate: true}],
    representativs: [{type: Schema.Types.ObjectId, ref: 'Representativ', autopopulate: true}],
})
TeamSchema.plugin(require('mongoose-autopopulate'));

module.exports = model('Team', TeamSchema);
