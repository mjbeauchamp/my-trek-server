import { Router } from "express";
import BackpackingArticle from "../models/BackpackingArticles.ts";

const router = Router();

// Fetch all Backpacking 101 articles 
router.get("/", async (req, res) => {
  try {
    const gear = await BackpackingArticle.find();
    res.json(gear);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;