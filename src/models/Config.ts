import { Schema, model } from "mongoose";
import { Config } from "../types/custom";

const configSchema = new Schema<Config>({
  tokensLastBlock: { type: BigInt, default: 0n },
  startBlock: { type: BigInt, default: 0n },
});

export default model<Config>("Config", configSchema);
