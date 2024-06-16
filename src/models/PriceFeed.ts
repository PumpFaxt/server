import { Schema, model } from "mongoose";
import { PriceFeed } from "../types/custom";

const priceFeedSchema = new Schema<PriceFeed>({
  address: { type: String, unique: true },
  data: { type: [{ marketCap: Number, price: Number, timestamp: Number }] },
  lastRefreshedBlock: { type: BigInt },
});

export default model<PriceFeed>("PriceFeed", priceFeedSchema);
