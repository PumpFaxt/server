import { Schema, model } from "mongoose";
import { Token } from "../types/custom";

const userSchema = new Schema<Token>({
  address: { type: String, unique: true },
  creator: { type: String },
  name: { type: String },
  image: { type: String },
  symbol: { type: String },
  website: { type: String },
  telegram: { type: String },
  twitter: { type: String },
});

export default model<Token>("Token", userSchema);
