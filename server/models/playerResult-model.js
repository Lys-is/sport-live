import { Schema, model } from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";
import player from "../controllers/api/player/index.js";

const PlayerResultSchema = new Schema({
   creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
   is_active: { type: Boolean, default: true },
   player: { type: Schema.Types.ObjectId, ref: "Player", autopopulate: true },
   player_fio: { type: String },
   team: { type: Schema.Types.ObjectId, ref: "Team" },
   match: { type: Schema.Types.ObjectId, ref: "Match" },
   red: { type: Number, default: 0 },
   yellow: { type: Number, default: 0 },
   transits: { type: Number, default: 0 },
   goals: { type: Number, default: 0 },
   status_doc: { type: String, default: "active", enum: ["active", "deleted"] },
});
PlayerResultSchema.plugin(mongooseAutoPopulate);

export default model("PlayerResult", PlayerResultSchema);
