import mongoose, { Document, Model, Schema } from "mongoose";

interface OTP extends Document {
  mobileNumber: string;
  otp: string;
  createdAt: Date;
}

const OTPSchema: Schema = new Schema({
  mobileNumber: String,
  otp: String,
  createdAt: { type: Date, expires: "1m", default: Date.now }, // OTP expires after 1 minute
});

const OTPModel: Model<OTP> = mongoose.model<OTP>("OTP", OTPSchema);
export default OTPModel;
