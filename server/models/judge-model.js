const {Schema, model} = require('mongoose');

const JudgeSchema = new Schema({
    email: {type: String, unique: true, required: true},
})

module.exports = model('Judge', JudgeSchema);
