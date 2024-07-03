const {Schema, model} = require('mongoose');

const CommentatorModel = new Schema({
    creator: {type: Schema.Types.ObjectId, ref: 'User', required: true, autopopulate: true},
    fio: {type: String, required: true},
    birthday: {type: String},
    img: {type: String},
    socials: {type: String},
    mobile: {type: String},
})

module.exports = model('Commentator', CommentatorModel);
