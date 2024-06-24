import express from "express";
import evm from "../../evm";
import Config from "../models/Config";
import contracts from "../../contracts";
import Token from "../models/Token";
import { getContract, isAddress } from "viem";
import { watchAllTrades } from "../hooks";
import PriceFeed from "../models/PriceFeed";
import { ONE_FRAX } from "../../config";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page =
      (typeof req.query.page == "string" && parseInt(req.query.page)) || 1;
    const limit =
      (typeof req.query.limit == "string" && parseInt(req.query.limit)) || 10;

    const startIndex = (page - 1) * limit;

    const response = {
      total: 0,
      tokens: [],
    };

    const total = await Token.countDocuments();

    response.total = total;

    response.tokens = await Token.find(
      {},
      {},
      { limit: limit, skip: startIndex }
    );
    res.status(200).send(response);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err });
  }
});

router.get("/:address", async (req, res) => {
  try {
    const { address } = req.params;
    if (typeof address != "string") return res.sendStatus(400);

    const token = await Token.findOne({ address: address });

    if (!token) return res.sendStatus(404);

    return res.status(200).send({ token: token });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

router.get("/by-user/:address", async (req, res) => {
  const { address } = req.params;

  if (typeof address != "string" || !isAddress(address))
    return res.sendStatus(400);

  const tokens = await Token.find({ creator: req.params.address });

  if (!tokens) return res.sendStatus(404);

  return res.status(200).send({ tokens: tokens });
});

export default router;
