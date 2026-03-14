// app/api/signup/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    await connectDB();

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await User.findOneAndUpdate(
      { email },
      { $set: { otp, otpExpires, verified: false } },
      { upsert: true, new: true }
    );

    // Send Email (optional)
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

await transporter.sendMail({
  from: `"CyberSentinel" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: 'Your CyberSentinel OTP',
  text: `Your OTP is: ${otp}`, // Fallback text
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>OTP Verification</title>
    </head>
    <body style="margin:0; padding:0; font-family:'Segoe UI', Roboto, monospace; background-color:#0D1117; color:#C9D1D9;">
      <div style="max-width:600px; margin:40px auto; background-color:#161B22; border-radius:10px; padding:30px; box-shadow:0 0 10px rgba(0,0,0,0.4);">
        <h2 style="color:#58A6FF; text-align:center;">🔐 CyberSentinel Verification</h2>
        <p style="font-size:16px; line-height:1.6;">Hello,</p>
        <p style="font-size:16px; line-height:1.6;">
          Please use the following OTP to complete your verification process:
        </p>
        <div style="background:#0D1117; color:#79C0FF; font-size:24px; font-weight:bold; text-align:center; padding:15px; margin:20px 0; border:1px solid #30363D; border-radius:8px;">
          ${otp}
        </div>
        <p style="font-size:14px; line-height:1.4; color:#8B949E;">
          This OTP is valid for the next 10 minutes. If you did not request this, please ignore this email.
        </p>
        <p style="text-align:center; margin-top:40px; font-size:12px; color:#6E7681;">
          &copy; ${new Date().getFullYear()} CyberSentinel. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `
});


    return NextResponse.json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
