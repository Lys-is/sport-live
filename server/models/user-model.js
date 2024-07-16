const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    tel: {type: String},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String},
    roles: [{type: String, ref: 'Role'}],
    tablo_style: {type: String, default: 'style_1'},
    isAdmin: {type: Boolean, default: false},
    isActive: {type: Boolean, default: false},
    dateActive: {type: String},
})

module.exports = model('User', UserSchema);
