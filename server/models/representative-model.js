const {Schema, model} = require('mongoose');

const RepresentativSchema = new Schema({
    creator: {type: Schema.Types.ObjectId, ref: 'User', required: true, autopopulate: true},
    fio: {type: String, required: true},
    birthday: {type: String},
    team: {type: Schema.Types.ObjectId, ref: 'Team', autopopulate: true},
    number: {type: String},
    img: {type: String},
    socials: {type: String},
    mobile: {type: String},
})
RepresentativSchema.plugin(require('mongoose-autopopulate'));
module.exports = model('Representativ', RepresentativSchema);
