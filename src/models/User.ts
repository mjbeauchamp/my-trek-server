import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  auth0Id: string;
  email?: string;
}

const UserSchema = new Schema(
  {
    auth0Id: { type: String, required: true, unique: true },
    email: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);