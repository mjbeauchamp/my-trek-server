import mongoose, { Schema, Types } from 'mongoose';

// Gear item data sent from frontend
export interface IGearItemInput {
    name: string;
    category?: string;
    notes?: string;
    quantityNeeded?: number;
    quantityToPack?: number;
    quantityToShop?: number;
}

// Gear item data as stored in DB
export interface IGearItem extends IGearItemInput {
    _id: Types.ObjectId;
}

export interface IGearList {
    userId: string;
    listTitle: string;
    listDescription?: string;
    items: IGearItem[];
}

const GearItemSchema = new Schema(
    {
        _id: { type: Schema.Types.ObjectId, auto: true },
        name: { type: String, required: true },
        category: { type: String },
        notes: { type: String },
        quantityNeeded: { type: Number, default: 1 },
        quantityToPack: { type: Number, default: 1 },
        quantityToShop: { type: Number, default: 0 },
    },
    { _id: true },
);

const GearListSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        listTitle: { type: String, required: true },
        listDescription: { type: String, required: false },
        items: [GearItemSchema],
    },
    { timestamps: true, collection: 'userGearLists' },
);

export default mongoose.model<IGearList>('UserGearList', GearListSchema);
