const {Schema, model} = require('mongoose');

const СouchSchema = new Schema({
    creator: {type: Schema.Types.ObjectId, ref: 'User', required: true, autopopulate: true},
    fio: {type: String, required: true},
    birthday: {type: String},
    team: {type: Schema.Types.ObjectId, ref: 'Team', autopopulate: true},
    position: {type: String},
    img: {type: String},
    socials: {type: String},
    mobile: {type: String},
    status_doc: {type: String, default: 'active', enum: ['active', 'deleted']},

})
СouchSchema.plugin(require('mongoose-autopopulate'));
module.exports = model('Сouch', СouchSchema);
