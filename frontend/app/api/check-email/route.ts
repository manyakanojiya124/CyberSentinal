import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/lib/models/User";
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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email")?.trim().toLowerCase();

  if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });

  await connectDB();
  const exists = await User.exists({ email });

  return NextResponse.json({ exists: Boolean(exists) });
}
