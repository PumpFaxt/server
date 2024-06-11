import express from "express";
import { authorisedOnly } from "../middleware/auth";
import User from "../models/User";
const router = express.Router();

router.post("/enqueue", authorisedOnly, async (req, res) => {
  const { name, symbol, image, website, description, telegram, twitter } =
    req.body;

  if (!req.user) return res.sendStatus(401);

  const creator = req.user.address;

  const user = await User.findOne({ address: creator });

  user?.queue.push({
    name,
    symbol,
    image,
    website,
    description,
    telegram,
    twitter,
  });

  if ((user?.queue?.length || 0) > 5) {
    await User.findOneAndUpdate({ address: creator }, { $pop: { tokens: -1 } });
  }

  await user?.save();

  return res.status(200).send({ success: true });
});

router.post("/new", async (req, res) => {});

export default router;
