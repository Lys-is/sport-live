const {Schema, model} = require('mongoose');

const TokenSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    refreshToken: {type: String, required: true, expires: 30*24*60*60 },
})

module.exports = model('Token', TokenSchema);
