import type { Request, Response } from "express";
import BackpackingArticle from "../models/BackpackingArticle";

export async function getAllArticles(req: Request, res: Response) {
  try {
    const articles = await BackpackingArticle.find();
    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching backpacking articles" });
  }
}