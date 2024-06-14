import express from "express";
import evm from "../../evm";
import Config from "../models/Config";
import contracts from "../../contracts";
import Token from "../models/Token";
import { getContract, isAddress } from "viem";
import { watchAllTrades } from "../hooks";
import PriceFeed from "../models/PriceFeed";
const router = express.Router();

router.post("/refresh", async (req, res) => {
  try {
    const config = await Config.findOne({});
    if (!config) throw "No config found";

    const tokens = await evm.client.getContractEvents({
      ...contracts.pumpItFaxtInterface,
      eventName: "Launch",
      fromBlock: config.tokensLastBlock,
      toBlock: "latest",
    });

    tokens.forEach(async (item) => {
      const tokenAddress = item.args.token;

      if (!tokenAddress) return;

      const token = getContract({
        abi: contracts.token.abi,
        address: tokenAddress,
        client: evm.client,
      });

      const metadata = JSON.parse(await token.read.metadata());

      const newToken = await Token.create({
        address: token.address,
        creator: await token.read.creator(),
        name: await token.read.name(),
        totalSupply: await token.read.totalSupply(),
        symbol: await token.read.symbol(),
        image: await token.read.image(),
        description: metadata.description,
        telegram: metadata.telegram,
        twitter: metadata.twitter,
        website: metadata.website,
      });

      const priceFeed = await PriceFeed.create({
        address: token.address,
        lastRefreshedBlock: evm.getBlockNumber(),
        data: [],
      });

      await priceFeed.save();
      await newToken.save();
    });

    const latestBlock = await evm.getBlockNumber();

    const updatedConfig = await Config.findOneAndUpdate(
      {},
      { $set: { tokensLastBlock: latestBlock } }
    );

    updatedConfig?.save();

    return res.status(200).send({ message: "Success" });
  } catch (err) {
    console.error(err);

    return res.sendStatus(500);
  }
});

router.get("/:address/feed", async (req, res) => {
  const { address } = req.params;

  if (!isAddress(address)) return res.sendStatus(400);
  watchAllTrades(address);

  const feed = await PriceFeed.findOneAndUpdate({ address: address });

  return res.status(200).send({ data: feed });
});

export default router;
