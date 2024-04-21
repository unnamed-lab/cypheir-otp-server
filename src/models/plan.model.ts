import { Document, Schema, model } from "mongoose";

interface IPlan extends Document {
  name: string;
  price: number;
  isActive: boolean;
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
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
});

const Plan = model<IPlan>("Plan", planSchema);

export = Plan;
