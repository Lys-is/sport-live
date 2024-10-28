import { Schema, model } from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";

const СouchSchema = new Schema({
   creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      autopopulate: true,
   },
   fio: { type: String, required: true },
   birthday: { type: String },
   team: { type: Schema.Types.ObjectId, ref: "Team", autopopulate: true },
   position: { type: String },
   img: { type: String },
   socials: { type: String },
   mobile: { type: String },
   status_doc: { type: String, default: "active", enum: ["active", "deleted"] },
});

СouchSchema.plugin(mongooseAutoPopulate);
export default model("Couch", СouchSchema);
