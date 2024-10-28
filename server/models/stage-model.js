import { Schema, model } from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";

const StageSchema = new Schema({
   tournament: {
      type: Schema.Types.ObjectId,
      ref: "Tournament",
      autopopulate: true,
      required: true,
   },
   name: { type: String, required: true },
   type: { type: String, default: "" },
   for_place: { type: String, required: true },
   rank: { type: String, required: true },
});

StageSchema.plugin(mongooseAutoPopulate);
export default model("Stage", StageSchema);
