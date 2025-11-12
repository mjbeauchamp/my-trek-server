import mongoose, { Schema, Document } from "mongoose";

export interface ICommonGear extends Document {
  _id: string;
  name: string;
  category?: string;
  weight?: number;
  notes?: string;
}

const CommonGearSchema: Schema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: false },
    weight: { type: String, required: false },
    notes: { type: String, required: false },
  },
  { collection: "commonGear" }
);

export default mongoose.model<ICommonGear>("CommonGear", CommonGearSchema);