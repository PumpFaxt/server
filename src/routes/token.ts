import express from "express";
import { authorisedOnly } from "../middleware/auth";
import User from "../models/User";
import evm from "../../evm";
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

router.post("/new", authorisedOnly, async (req, res) => {
  if (!req.user?.address) return res.sendStatus(401);

  const user = await User.findOne({ address: req.user.address });

  const tokens = await evm.pumpItFaxt.queryFilter(
    evm.pumpItFaxt.filters.Launch(req.user.address),
    user?.lastTokensBlock,
    "latest"
  );

  tokens.forEach((token) => console.log(token.data));
});

export default router;
