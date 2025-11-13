import mongoose, { Schema, Document } from "mongoose";

export interface ICommonGear extends Document {
  name: string;
  category?: string;
}

const CommonGearSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: false },
  },
  { collection: "commonGear" }
);

export default mongoose.model<ICommonGear>("CommonGear", CommonGearSchema);