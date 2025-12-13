import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    auth0Id: string;
    email?: string;
    name?: string;
}

const UserSchema = new Schema(
    {
        auth0Id: { type: String, required: true, unique: true },
        email: { type: String, required: false },
        name: { type: String, required: false },
    },
    { timestamps: true },
);

export default mongoose.model<IUser>('User', UserSchema);
