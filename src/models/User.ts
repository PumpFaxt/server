import { Schema, model } from "mongoose";
import { User } from "../types/custom";

const userSchema = new Schema<User>({
  address: { type: String, unique: true },
  nickname: { type: String },
  image: { type: String },
  lastTokensBlock: { type: Number, default: 0 },
});

export default model<User>("User", userSchema);
