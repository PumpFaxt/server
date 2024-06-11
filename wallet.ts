import { ethers } from "ethers";
import crypto from "crypto";

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
const wallet = new ethers.Wallet(
  crypto.randomBytes(32).toString("hex"),
  provider
);

export default wallet;
