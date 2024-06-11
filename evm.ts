import { ethers } from "ethers";
import crypto from "crypto";
import contracts from "./contracts";

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
const wallet = new ethers.Wallet(
  crypto.randomBytes(32).toString("hex"),
  provider
);

const pumpItFaxt = new ethers.Contract(
  contracts.pumpItFaxt.address,
  contracts.pumpItFaxt.abi,
  provider
);

async function getBlockNumber() {
  return await provider.getBlockNumber();
}

export default { wallet, pumpItFaxt, getBlockNumber };
