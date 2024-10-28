import { Schema, model } from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";

const PlayerSchema = new Schema({
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
   number: { type: String },
   img: { type: String },
   description: { type: String },
   ampl: { type: String },
   num: { type: Number, default: 0 },
   socials: { type: String },
   mobile: { type: String },
   status_doc: { type: String, default: "active", enum: ["active", "deleted"] },
});
PlayerSchema.pre("save", function (next) {
   if (!this.team) this.team = null;
   next();
});

PlayerSchema.plugin(mongooseAutoPopulate);
export default model("Player", PlayerSchema);
