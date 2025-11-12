import mongoose, { Schema, Document } from "mongoose";

export interface IGear extends Document {
  name: string;
}

const CommonGearSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
  },
  { collection: "commonGear" }
);

export default mongoose.model<IGear>("CommonGear", CommonGearSchema);