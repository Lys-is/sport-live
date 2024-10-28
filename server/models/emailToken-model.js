import { Schema, model } from "mongoose";

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
      expires: 2 * 60 * 60,
   },
});

const EmailToken = model("emailToken", tokenSchema);
export default EmailToken;
