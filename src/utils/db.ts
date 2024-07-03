import { getContract } from "viem";
import contracts from "../../contracts";
import evm from "../../evm";
import Config from "../models/Config";
import Token from "../models/Token";

export async function ensureConfig() {
  const configExists = await Config.countDocuments();
  if (configExists == 0) {
    console.log("Creating new config");
    const newConfig = await Config.create({
      tokensLastBlock:
        ((await evm.getBlockNumber()) * BigInt(97)) / BigInt(100),
      startBlock: ((await evm.getBlockNumber()) * BigInt(97)) / BigInt(100),
    });
    await newConfig.save();
  }
}

export async function refreshTokens() {
  try {
    const config = await Config.findOne({});
    if (!config) throw "No config found";

    const tokens = await evm.client.getContractEvents({
      ...contracts.pumpItFaxtInterface,
      eventName: "Launch",
      fromBlock: config.tokensLastBlock,
      toBlock: "latest",
    });

    console.log(tokens);

    tokens.forEach(async (item) => {
      const tokenAddress = item.args.token;

      if (!tokenAddress) return;

      const token = getContract({
        abi: contracts.token.abi,
        address: tokenAddress,
        client: evm.client,
      });

      const metadata = JSON.parse(await token.read.metadata());

      await Token.deleteOne({ address: token.address });

      const newToken = await Token.create({
        address: token.address,
        createdBlock: (await token.read.createdBlock()).toString(),
        creator: await token.read.creator(),
        name: await token.read.name(),
        totalSupply: Number((await token.read.totalSupply()) / evm.ONE_TOKEN),
        symbol: await token.read.symbol(),
        image: await token.read.image(),
        description: metadata.description,
        telegram: metadata.telegram,
        twitter: metadata.twitter,
        website: metadata.website,
      });

      await newToken.save();

      const updatedConfig = await Config.findOneAndUpdate(
        {},
        { $set: { tokensLastBlock: item.blockNumber + BigInt(1) } }
      );
      updatedConfig?.save();
    });
  } catch (err) {
    console.error(err);
  }
}
