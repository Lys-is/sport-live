const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  email: {
    type: String,

  },
  token: {
    type: String,
    required: true,
    expires: 2*60*60
  },
});

const EmailToken = mongoose.model("emailToken", tokenSchema);

module.exports = EmailToken;