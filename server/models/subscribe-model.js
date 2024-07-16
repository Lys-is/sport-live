const {Schema, model} = require('mongoose');

const SubscribeSchema = new Schema({
    creator: {type: Schema.Types.ObjectId, ref: 'User', required: true, autopopulate: true, unique: true},
    date: {type: String, required: true},
    createdAt: { type: Date, default: () => (Date.now() + 30 * 24 * 60 * 60 * 1000), expires: 0}
})

SubscribeSchema.pre('save', function(next) {
    this.createdAt = this.createdAt.setHours(23, 59, 59, 999);
    //this.setExpiryDate(3);  
    next();
})
SubscribeSchema.methods.setExpiryDateValue = function(date) {
    let ndate = new Date(date);
    this.createdAt = ndate.setHours(23, 59, 59, 999);
    this.save()
}

SubscribeSchema.methods.setExpiryDate = function(days) {
    this.createdAt = new Date(Date.now() + days * 1000 * 60) //days * 1000 * 60 * 60 * 24);
};
module.exports = model('Subscribe', SubscribeSchema);
