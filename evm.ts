import crypto from "crypto";
import contracts from "./contracts";

import {
  createPublicClient,
  createWalletClient,
  getContract,
  http,
  publicActions,
} from "viem";
import { fraxtal } from "viem/chains";

const rpcUrl = "https://rpc.frax.com/";
const pvtKey = crypto.randomBytes(32).toString("hex");

const publicClient = createPublicClient({
  chain: fraxtal,
  transport: http(rpcUrl),
});

const client = createWalletClient({
  chain: fraxtal,
  transport: http(rpcUrl),
  key: pvtKey,
}).extend(publicActions);

const pumpItFaxt = getContract({
  ...contracts.pumpItFaxtInterface,
  client: { public: publicClient, wallet: client },
});

async function getBlockNumber() {
  return await client.getBlockNumber();
}

const ONE_FRAX = BigInt(Math.pow(10, 18));
const ONE_TOKEN = BigInt(Math.pow(10, 18));

export default { client, pumpItFaxt, getBlockNumber, ONE_FRAX, ONE_TOKEN };
