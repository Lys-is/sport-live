const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String},
    roles: [{type: String, ref: 'Role'}],
    address: {type: String, required: true},
    tablo_style: {type: String, default: 'style_1'}
})

module.exports = model('User', UserSchema);
