import { Schema, model } from "mongoose";

interface IPlan {
  name: string;
  price: number;
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
});

const Plan = model<IPlan>("Plan", planSchema);

export = { Plan };
