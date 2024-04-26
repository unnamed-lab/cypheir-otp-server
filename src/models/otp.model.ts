import { Schema, model, Types, Document } from "mongoose";

interface IOTP extends Document {
  package: Types.ObjectId;
  key: string;
  expiry: Schema.Types.Date;
  attempts: number;
  validation: boolean;
  created_on: Schema.Types.Date;
}

const otpSchema = new Schema<IOTP>({
  package: {
    type: Schema.Types.ObjectId,
    ref: "Package",
    required: true,
  },
  key: {
    type: String,
    required: true,
  },
  expiry: {
    type: Date,
    required: true,
    immutable: true,
  },
  attempts: {
    type: Number,
    required: true,
    default: 3,
    max: 3,
    min: 0,
  },
  validation: {
    type: Boolean,
    required: true,
    default: false,
  },
  created_on: {
    type: Date,
    required: true,
    default: Date.now,
    immutable: true,
  },
});

const OTP = model<IOTP>("OTP", otpSchema);

export = OTP;
