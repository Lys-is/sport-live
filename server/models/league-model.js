const {Schema, model} = require('mongoose');

const LeagueDSchema = new Schema({
    creator: {type: Schema.Types.ObjectId, ref: 'User', required: true, autopopulate: true},
    img: {type: String},
    name: {type: String, required: true, default: 'Моя лига'},
    description: {type: String, default: ''},
})

module.exports = model('League', LeagueDSchema);
