const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    nickname: {type: String, unique: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String},
    roles: [{type: String, ref: 'Role'}],
    tablo_style: {type: String, default: 'style_1'},
    isAdmin: {type: Boolean, default: false},
    isActive: {type: Boolean, default: false}
})

module.exports = model('User', UserSchema);
