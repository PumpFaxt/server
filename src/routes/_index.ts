import express from "express";
import exampleRouter from "./example";
import userRouter from "./user";
import tokenRouter from "./token";
import huddleRouter from "./huddle";

const router = express.Router();

router.use("/example", exampleRouter);
router.use("/user", userRouter);
router.use("/token", tokenRouter);
router.use("/huddle", huddleRouter);

router.get("/", (req, res) => {
  res.send(
    `Backend running successfully on ${
      req.protocol + "://" + req.get("host") + req.originalUrl
    }`
  );
});

export default router;
