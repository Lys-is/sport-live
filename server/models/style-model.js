const {Schema, model} = require('mongoose');

const StyleShema = new Schema({
    creator: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    based: {type: String, default: ''},
    name: {type: String, default: ''},
    font: {type: String, default: ''},
    color_main: {type: String, default: ''},
    color_accent: {type: String, default: ''},
    color_accent_2: {type: String, default: ''},
    color_notif: {type: String, default: ''},
    color_notif_accent: {type: String, default: ''},
    color_text_notif: {type: String, default: '#ffffff'},
    opacity: {type: Number, default: 1},
})

module.exports = model('Style', StyleShema);
