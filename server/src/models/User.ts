import mongoose, { Schema, Document } from 'mongoose';
import { User as IUser } from '../types';

interface UserDocument extends IUser, Document {}

const userSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Analyst', 'Viewer'], default: 'Viewer' },
    status: { type: String, enum: ['Active', 'Disabled', 'Deleted'], default: 'Active' },
    lastLoginAt: Date,
    deletedAt: Date,
  },
  { timestamps: true }
);

export const User = mongoose.model<UserDocument>('User', userSchema);
