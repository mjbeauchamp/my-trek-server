import { Router } from "express";
import CommonGear from "../models/CommonGear.ts";

const router = Router();

// GET /api/gear - fetch all gear
router.get("/", async (req, res) => {
    console.log('BOOP!!')
  try {
    const gear = await CommonGear.find(); // pull all documents from commonGear
    console.log(gear);
    res.json(gear);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;