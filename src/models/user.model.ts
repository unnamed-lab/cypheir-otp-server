import { Schema, Types, model } from "mongoose";

interface IUser {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  isAdmin: boolean;
  plan: Types.ObjectId;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: true },
  plan: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
});

const User = model<IUser>("User", userSchema);

export = { User };
