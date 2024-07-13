const {Schema, model} = require('mongoose');

const DocsSchema = new Schema({
    creator: {type: Schema.Types.ObjectId, ref: 'User', required: true, autopopulate: true},
    name: {type: String, required: true},
    doc: {type: String, default: '', required: true},
    tournament: {type: Schema.Types.ObjectId, ref: 'Tournament'},
    type: {type: String,  enum: ['guide', 'doc'], required: true},
    date: {type: String},
    status_doc: {type: String, default: 'active', enum: ['active', 'deleted']},
    is_published: {type: Boolean, default: true},

})
DocsSchema.plugin(require('mongoose-autopopulate'));
module.exports = model('Doc', DocsSchema);
