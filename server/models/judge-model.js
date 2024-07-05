const {Schema, model} = require('mongoose');

const JudgeSchema = new Schema({
    creator: {type: Schema.Types.ObjectId, ref: 'User', required: true, autopopulate: true},
    fio: {type: String, required: true},
    birthday: {type: String},
    img: {type: String},
    socials: {type: String},
    mobile: {type: String},
    status_doc: {type: String, default: 'active', enum: ['active', 'deleted']},

})

module.exports = model('Judge', JudgeSchema);
