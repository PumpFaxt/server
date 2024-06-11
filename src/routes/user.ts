import ethers from "ethers";

import express from "express";
const router = express.Router();

const nonceStorage: Record<string, string> = {};

router.post("/request-nonce", (req, res) => {
  const { address } = req.query;
  if (!address || !ethers.isAddress(address))
    return res.status(400).send("Missing or invalid address");

  const nonce = Math.floor(Math.random() * 1000000);

  nonceStorage[
    address.toString()
  ] = `I am ${address}; log me in to pumpfaxt.it; nonce : ${nonce}`;

  res.status(200).send({ message: nonceStorage[address.toString()] });
});

export default router;
