import { Schema, model } from "mongoose";

const SeasonSchema = new Schema({
   creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      autopopulate: true,
   },
   name: { type: String, required: true },
   start: { type: String, required: true },
   end: { type: String, required: true },
   status_doc: { type: String, default: "active", enum: ["active", "deleted"] },
});

export default model("Season", SeasonSchema);
