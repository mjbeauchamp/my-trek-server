import { Router } from "express";
import CommonGear from "../models/CommonGear.ts";

const router = Router();

// Fetch list of commonly used gear
router.get("/", async (req, res) => {
  try {
    const gear = await CommonGear.find();
    console.log(gear);
    res.json(gear);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;