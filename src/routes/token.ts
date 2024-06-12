import express from "express";
import User from "../models/User";
import evm from "../../evm";
const router = express.Router();

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
