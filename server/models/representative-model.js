import { Schema, model } from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";

const RepresentativSchema = new Schema({
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

RepresentativSchema.plugin(mongooseAutoPopulate);
export default model("Representativ", RepresentativSchema);
