import express from "express";
import exampleRouter from "./example";
import tokensRouter from "./tokens";
import huddleRouter from "./huddle";

const router = express.Router();

router.use("/example", exampleRouter);
router.use("/tokens", tokensRouter);
router.use("/huddle", huddleRouter);

router.get("/", (req, res) => {
  res.send(
    `Backend running successfully on ${
      req.protocol + "://" + req.get("host") + req.originalUrl
    }`
  );
});

export default router;
