const {Schema, model} = require('mongoose');

const UserDSchema = new Schema({
    creator: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    name: {type: String, default: ''},
    surname: {type: String, default: ''},
    patronymic: {type: String, default: ''},
    site_adress: {type: String, default: ''},
})

module.exports = model('UserD', UserDSchema);
