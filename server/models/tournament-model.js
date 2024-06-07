const {Schema, model} = require('mongoose');

const Tournament = new Schema({
    creator: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    full_name: {type: String, unique: true, required: true},
    name: {type: String, unique: true, required: true},
    description: {type: String, required: true},
    date_start: {type: Date, required: true},
    date_end: {type: Date, required: true},
    type: {type: String, required: true},
    is_site: {type: Boolean, default: false},
    is_calendar: {type: Boolean, default: false},
})

module.exports = model('Tournament', Tournament);
