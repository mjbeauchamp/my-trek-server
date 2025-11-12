import mongoose, { Schema, Document } from "mongoose";

export interface IGearItem {
    name: string;
    category?: string;
    isPacked?: boolean;
    quantityToPack?: number;
    quantityToShop?: number;
    weight?: number;    
    notes?: string;
}

export interface IGearList extends Document {
    userId: string; // Auth0 user ID
    items: IGearItem[];
    }

const GearItemSchema = new Schema({
    name: { type: String, required: true },
    category: { type: String },
    isPacked: { type: Boolean},
    weight: { type: Number },
    quantityToPack: { type: Number },
    quantityToShop: { type: Number },
    notes: { type: String },
});

const GearListSchema = new Schema(
  {
    userId: { type: String, required: true },
    items: [GearItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model<IGearList>("UserGearList", GearListSchema);