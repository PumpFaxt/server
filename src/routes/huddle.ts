import express from "express";
import { createToken } from "../utils";
import { Role } from "@huddle01/server-sdk/auth";
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

export default router;
