import { Document, Schema, Types, model } from "mongoose";

interface IPackage extends Document {
  user: Types.ObjectId;
  key: string;
  active: boolean;
}

const packageSchema = new Schema<IPackage>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  key: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
    required: true,
  },
});

const Package = model<IPackage>("Package", packageSchema);

export = Package;
