import express from "express";
import exampleRouter from "./example";
import tokensRouter from "./tokens";
import huddleRouter from "./huddle";
import faucetRouter from "./faucet";

const router = express.Router();

router.use("/example", exampleRouter);
router.use("/tokens", tokensRouter);
router.use("/huddle", huddleRouter);
router.use("/faucet", faucetRouter);

router.get("/", (req, res) => {
  res.send(
    `Backend running successfully on ${
      req.protocol + "://" + req.get("host") + req.originalUrl
    }`
  );
});

export default router;
