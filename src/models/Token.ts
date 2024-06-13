import { Schema, model } from "mongoose";
import { Token } from "../types/custom";

const tokenSchema = new Schema<Token>({
  address: { type: String, unique: true },
  creator: { type: String },
  name: { type: String },
  description: { type: String },
  image: { type: String },
  symbol: { type: String },
  website: { type: String },
  telegram: { type: String },
  twitter: { type: String },
});

tokenSchema.index({ creator: 1, symbol: 1 }, { unique: true });

export default model<Token>("Token", tokenSchema);
