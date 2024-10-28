import { Schema, model } from "mongoose";

const TokenSchema = new Schema({
   user: { type: Schema.Types.ObjectId, ref: "User" },
   refreshToken: { type: String, required: true, expires: 30 * 24 * 60 * 60 },
});

export default model("Token", TokenSchema);
