import { Schema, model } from "mongoose";
import { User } from "../types/custom";

const userSchema = new Schema<User>({
  address: { type: String, unique: true },
  nickname: { type: String, unique: true },
  image: { type: String },
});

export default model<User>("User", userSchema);
