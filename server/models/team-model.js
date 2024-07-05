const {Schema, model} = require('mongoose');

const TeamSchema = new Schema({
    creator: {type: Schema.Types.ObjectId, ref: 'User', required: true, autopopulate: true},
    name: {type: String, required: true},
    description: {type: String, default: ''},
    website: {type: String, default: ''},
    social: {type: String, default: ''},
    date: {type: String, required: true},
    img: {type: String},
    color: {type: String},
    admins: [{type: Schema.Types.ObjectId, ref: 'User', required: true, autopopulate: true}],
    representativs: [{type: Schema.Types.ObjectId, ref: 'Representativ', autopopulate: true}],
    status_doc: {type: String, default: 'active', enum: ['active', 'deleted']},
})
TeamSchema.plugin(require('mongoose-autopopulate'));

module.exports = model('Team', TeamSchema);
