import { Address } from "viem";
import contracts from "../../contracts";
import evm from "../../evm";
import PriceFeed from "../models/PriceFeed";

const watchingTrades: string[] = [];

export async function watchAllTrades(address: Address) {
  if (watchingTrades.includes(address)) return;
  watchingTrades.push(address);

  const priceFeed = await PriceFeed.findOne({ address: address });

  evm.client.watchContractEvent({
    address: address,
    abi: contracts.token.abi,
    eventName: "PriceChange",
    fromBlock: priceFeed?.lastRefreshedBlock,
    onLogs: (logs) => {
      logs.forEach(
        async (log) =>
          await PriceFeed.updateOne(
            { address: address },
            {
              $push: { data: { ...log.args } },
              lastRefreshedBlock: log.blockNumber,
            }
          )
      );
    },
  });
}
