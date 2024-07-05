import contracts from "./contracts";

import { createWalletClient, getContract, http, publicActions } from "viem";
import { fraxtalTestnet } from "viem/chains";

const primaryChain = fraxtalTestnet;

const rpcUrl = primaryChain.rpcUrls.default.http[0];
const client = createWalletClient({
  chain: primaryChain,
  transport: http(rpcUrl),
  key: process.env.PVT_KEY,
  account: process.env.PUB_KEY as "0x",
}).extend(publicActions);

const faucet = getContract({
  ...contracts.faucet,
  client: { public: client, wallet: client },
});

const getBalance = client.getBalance;

const account = client.account;

export default { contract: faucet, getBalance, account };
