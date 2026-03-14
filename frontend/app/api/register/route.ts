import { NextResponse } from "next/server";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const MONGODB_URI = process.env.MONGODB_URI!;
declare global {
  var mongoose: { conn: mongoose.Connection | null } | undefined;
}
export {};
let cached = global.mongoose || (global.mongoose = { conn: null });

async function connectDB() {
  if (!cached.conn) cached.conn = (await mongoose.connect(MONGODB_URI)).connection;
  return cached.conn;
}

const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
  verified: Boolean,
});
const User = mongoose.models.User || mongoose.model("User", userSchema);

export async function POST(req: Request) {
  const { email, username, password } = await req.json();
  await connectDB();

  const user = await User.findOne({ email });
  if (!user?.verified) {
    return NextResponse.json({ error: "Email not verified" }, { status: 400 });
  }

  if (await User.findOne({ username })) {
    return NextResponse.json({ error: "Username taken" }, { status: 400 });
  }

  user.username = username;
  user.password = await bcrypt.hash(password, 10);
  await user.save();

  return NextResponse.json({ message: "Registered successfully" });
}
