import { Document, Schema, model } from "mongoose";

interface IPlan extends Document {
  name: string;
  price: number;
  index: number;
  otp: number;
  bulk: number;
  perks: Array<string> | string;
  isActive?: boolean;
}

const planSchema = new Schema<IPlan>({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
    max: 1000,
    min: 0,
  },
  index: {
    type: Number,
    index: true,
    required: true,
    min: 0,
    max: 12,
  },
  otp: {
    type: Number,
    required: true,
    min: 0,
    max: 1000000,
    default: 2000,
  },
  bulk: {
    type: Number,
    index: true,
    required: true,
    max: 10000000,
    default: 5000,
  },
  perks: {
    type: Schema.Types.Mixed,
    default: undefined,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
});

const Plan = model<IPlan>("Plan", planSchema);

export = Plan;
