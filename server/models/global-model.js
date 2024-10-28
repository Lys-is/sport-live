import { Schema, model } from "mongoose";

const GlobalSchema = new Schema({
   name: { type: String, default: "", unique: true },
   data: { type: String, default: "" },
});

export default model("Global", GlobalSchema);
