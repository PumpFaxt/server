import express from "express";
const router = express.Router();

router.get("/new", (req, res) => {
  res.send({ message: "success" });
});

export default router;
