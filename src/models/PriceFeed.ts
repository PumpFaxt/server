import { Schema, model } from "mongoose";
import { PriceFeed } from "../types/custom";

const priceFeedSchema = new Schema<PriceFeed>({
  address: { type: String, unique: true },
  data: { type: [{ marketCap: BigInt, price: BigInt, timestamp: BigInt }] },
  lastRefreshedBlock: { type: BigInt },
});

export default model<PriceFeed>("PriceFeed", priceFeedSchema);
