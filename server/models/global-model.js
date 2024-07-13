const {Schema, model} = require('mongoose');

const GlobalSchema = new Schema({
    name: {type: String, default: '', unique: true},
    data: {type: String, default: ''}
})

module.exports = model('Global', GlobalSchema);
