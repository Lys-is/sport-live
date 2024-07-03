const {Schema, model} = require('mongoose');

const StyleShema = new Schema({
    creator: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    based: {type: String, default: ''},
    name: {type: String, default: ''},
    font: {type: String, default: ''},
    color_main: {type: String, default: ''},
    color_accent: {type: String, default: ''},
    color_accent_2: {type: String, default: ''},
})

module.exports = model('Style', StyleShema);
