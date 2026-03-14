// models/User.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  username?: string;
  password?: string;
  image?: string;
  createdAt: Date;
  otp?: string;
  otpExpires?: Date;
  verified?: boolean;
  googleId?: string;
  githubId?: string;
  linkVisits: { today: number; thisWeek: number; thisMonth: number };
  linkHistory: { url: string; status: string; time: string }[];
  quizHighScore: number;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  username: { type: String, unique: true, sparse: true },
  password: { type: String },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
  otp: { type: String },
  otpExpires: { type: Date },
  verified: { type: Boolean, default: false },
  googleId: { type: String },
  githubId: { type: String },
  linkVisits: {
    today: { type: Number, default: 0 },
    thisWeek: { type: Number, default: 0 },
    thisMonth: { type: Number, default: 0 },
  },
  linkHistory: [{ url: String, status: String, time: String }],
  quizHighScore: { type: Number, default: 0 },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
