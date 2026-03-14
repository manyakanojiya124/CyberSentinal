// app/api/verify-otp/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/db"; // or your path
import User from "@/lib/models/User";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp)
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });

    await connectDB();

    const user = await User.findOne({ email });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 400 });

    console.log("Stored OTP:", user.otp);
    console.log("Provided OTP:", otp);
    console.log("OTP expires at:", user.otpExpires);
    console.log("Current time:", new Date());
    if (
      user.otp !== otp ||
      !user.otpExpires ||
      new Date(user.otpExpires) < new Date()
    ) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    user.verified = true;
    user.otp = "";
    user.otpExpires = null;
    await user.save();

    return NextResponse.json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
