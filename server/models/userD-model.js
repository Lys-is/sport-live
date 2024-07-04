const {Schema, model} = require('mongoose');

const UserDSchema = new Schema({
    creator: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    name: {type: String, default: ''},
    surname: {type: String, default: ''},
    patronymic: {type: String, default: ''},
    site_img: {type: String, default: '/static/styles/icons/logo.jpg'},
    site_name: {type: String, default: 'Sportlive'},
})

module.exports = model('UserD', UserDSchema);
