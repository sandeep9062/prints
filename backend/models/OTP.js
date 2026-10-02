import mongoose, { Schema } from "mongoose";

const OTPSchema = new Schema(
  {
    email: String,
    otp: String,
    expiresAt: Date,
  },
  { timestamps: true }
);

export default mongoose.models.OTP || mongoose.model("OTP", OTPSchema);
