import { Schema, model, Types } from "mongoose";

interface IOTP {
  package: Types.ObjectId;
  key: string;
  expiry: Schema.Types.Date;
  validation: boolean;
}

const otpSchema = new Schema<IOTP>({
  package: { type: Schema.Types.ObjectId, ref: "Package", required: true },
  key: { type: String, required: true },
  expiry: {
    type: Date,
    required: true,
    immutable: true, // Makes u=sure the item can bot be changed
    default: Date.now() + 120000, // Adds 2 mins to the time
  },
  validation: { type: Boolean, required: true, default: false },
});

const OTP = model<IOTP>("OTP", otpSchema);

export = { OTP };
