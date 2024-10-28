import { Schema, model } from "mongoose";

const LeagueDSchema = new Schema({
   creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      autopopulate: true,
   },
   img: { type: String },
   name: { type: String, required: true, default: "Моя лига" },
   address: { type: String, required: true },
   description: { type: String, default: "" },
});

export default model("League", LeagueDSchema);
