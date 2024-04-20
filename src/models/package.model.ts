import { Schema, Types, model } from "mongoose";

interface IPackage {
  user: Types.ObjectId;
  key: string;
}

const packageSchema = new Schema<IPackage>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  key: {
    type: String,
  },
});

const Package = model<IPackage>("Package", packageSchema);

export = { Package };
