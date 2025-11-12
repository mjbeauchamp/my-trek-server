import mongoose, { Schema, Document, Types } from "mongoose";

export interface IGearItem {
    name: string;
    category?: string;
    notes?: string;
    quantityNeeded?: number;
    quantityToPack?: number;
    quantityToShop?: number;
}

export interface IGearList extends Document {
  userId: Types.ObjectId; 
  listTitle: string;
  items: IGearItem[];
}

const GearItemSchema = new Schema({
    name: { type: String, required: true },
    category: { type: String },
    notes: { type: String },
    quantityNeeded: { type: Number, default: 1},
    quantityToPack: { type: Number, default: 0 },
    quantityToShop: { type: Number, default: 0 },
});

const GearListSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    listTitle: { type: String, required: true },
    items: [GearItemSchema],
  },
  { timestamps: true, collection: 'userGearLists' }
);

export default mongoose.model<IGearList>("UserGearList", GearListSchema);