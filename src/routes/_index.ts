import express from "express";
import exampleRouter from "./example";
import tokenRouter from "./token";
const router = express.Router();

router.use("/example", exampleRouter);
router.use("/token", tokenRouter);

router.get("/", (req, res) => {
  res.send(
    `Backend running successfully on ${
      req.protocol + "://" + req.get("host") + req.originalUrl
    }`
  );
});

export default router;
