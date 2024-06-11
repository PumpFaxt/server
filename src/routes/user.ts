import { isAddress } from "ethers";
import jwt from "jsonwebtoken";

import express from "express";
import { verifySignature } from "../utils/utils";
import { unauthorisedOnly } from "../middleware/auth";
const router = express.Router();

const nonceStorage: Record<string, string> = {};

router.post("/request-nonce", unauthorisedOnly, (req, res) => {
  const { address } = req.query;
  if (!address || !isAddress(address))
    return res.status(400).send("Missing or invalid address");

  const nonce = Math.floor(Math.random() * 1000000);

  nonceStorage[
    address.toString()
  ] = `I am ${address}; log me in to pumpfaxt.it; nonce : ${nonce}`;

  return res.status(200).send({ message: nonceStorage[address.toString()] });
});

router.post("/login", unauthorisedOnly, (req, res) => {
  const { address, signature } = req.query;

  if (!process.env.ACCESS_TOKEN_SECRET) return res.sendStatus(500);

  if (!address || !isAddress(address) || !signature)
    return res.status(400).send("Invalid address or signature");

  const recoveredAddress = verifySignature(
    nonceStorage[address.toString()],
    signature.toString()
  );

  if (recoveredAddress != address) return res.status(401).send("Forbidden");

  const accessToken = jwt.sign(address, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "20h",
  });

  return res.status(200).send({ token: accessToken });
});

export default router;
