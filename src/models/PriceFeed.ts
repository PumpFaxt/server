import { Schema, model } from "mongoose";
import { PriceFeed } from "../types/custom";

const priceFeedSchema = new Schema<PriceFeed>({
  address: { type: String, unique: true },
  data: { type: [{ marketCap: Number, price: Number, timestamp: Number }] },
  lastRefreshedBlock: { type: BigInt },
});

priceFeedSchema.index({ creator: 1, symbol: 1 }, { unique: true });

export default model<PriceFeed>("PriceFeed", priceFeedSchema);
