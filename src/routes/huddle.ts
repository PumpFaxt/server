import express from "express";
import { createToken, generateRandomHex } from "../utils";
import { Role } from "@huddle01/server-sdk/auth";
import Token from "../models/Token";
import { recoverMessageAddress } from "viem";
const router = express.Router();

router.get("/token", async (req, res) => {
  const { roomId, name } = req.query;

  if (
    !roomId ||
    typeof roomId !== "string" ||
    !name ||
    typeof name !== "string"
  ) {
    return res.status(200).send("Missing roomId");
  }

  let token: string;

  try {
    const response = await fetch(
      `https://api.huddle01.com/api/v1/live-meeting/preview-peers?roomId=${roomId}`,
      {
        headers: {
          "x-api-key": process.env.HUDDLE_API_KEY ?? "",
        },
      }
    );
    const data = await response.json();
    const { previewPeers } = data;

    token = await createToken(
      roomId,
      previewPeers.length > 0 ? Role.LISTENER : Role.HOST,
      name
    );
  } catch (error) {
    token = await createToken(roomId, Role.HOST, name ?? "Guest");
  }

  return res.status(200).send({ token: token });
});

const nonceStore: Record<string, string> = {};
router.get("/new-meeting-nonce", async (req, res) => {
  const { tokenAddress } = req.query;
  if (typeof tokenAddress != "string") return res.sendStatus(400);

  const token = await Token.findOne({ address: tokenAddress });

  if (!token) return res.sendStatus(400);

  if (token.roomId) {
    token.roomId = undefined;
  }
  if (token.roomIdExpiration) {
    token.roomIdExpiration = undefined;
  }

  await token.save();

  nonceStore[token.creator] =
    "Start a new voice channel on PumpFaxt (Pump it fast)\nnonce: 0x" +
    generateRandomHex(16) +
    "\n\nThis won't trigger any transactions";
  res.status(200).send({ nonce: nonceStore[token.creator] });
});

router.post("/new-meeting", async (req, res) => {
  const { signature, tokenAddress } = req.query;
  if (typeof signature != "string") return res.sendStatus(400);
  if (typeof tokenAddress != "string") return res.sendStatus(400);

  const token = await Token.findOne({ address: tokenAddress });
  if (!token) return res.sendStatus(400);

  const recoveredAddress = await recoverMessageAddress({
    message: nonceStore[token.creator],
    signature: signature as "0x",
  });

  if (recoveredAddress != token.creator) return res.sendStatus(403);

  const response = await fetch("https://api.huddle01.com/api/v1/create-room", {
    body: JSON.stringify({
      title: token.name,
      hostWallets: [token.creator],
    }),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.HUDDLE_API_KEY ?? "",
    },
  });

  const { data } = await response.json();
  const { roomId } = data;

  token.roomId = roomId;
  token.roomIdExpiration = Date.now() + 30 * 60 * 1000;

  await token.save();

  return res.status(200).send({ message: "Success", roomId: roomId });
});

export default router;
