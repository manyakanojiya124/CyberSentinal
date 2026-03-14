const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
  linkHistory: [
    {
      url: String,
      status: String,
      time: String,
    },
  ],
  quizHighScore: { type: Number, default: 0 },
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
