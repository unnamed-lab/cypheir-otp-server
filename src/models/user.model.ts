import { Document, Schema, Types, model } from "mongoose";

export interface IUser extends Document { 
  username?: string;
  firstname?: string;
  lastname?: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  plan?: Types.ObjectId;
}

const userSchema = new Schema<IUser>({ 
  username: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  plan: {
    type: Schema.Types.ObjectId,
    ref: "Plan",
    // required: true,
  },
});

export const User = model<IUser>("User", userSchema);
