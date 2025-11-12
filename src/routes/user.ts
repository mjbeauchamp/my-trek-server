import { Router } from "express";
import User from "../models/User.ts";

const router = Router();

// Fetch user data
router.get("/", async (req, res) => {
  try {
    const gear = await User.find();
    res.json(gear);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;