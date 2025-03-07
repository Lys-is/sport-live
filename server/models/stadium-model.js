import { Schema, model } from "mongoose";

const StadiumSchema = new Schema({
   email: { type: String, unique: true, required: true },
   password: { type: String, required: true },
   isActivated: { type: Boolean, default: false },
   activationLink: { type: String },
   roles: [{ type: String, ref: "Role" }],
});

export default model("Stadium", StadiumSchema);
