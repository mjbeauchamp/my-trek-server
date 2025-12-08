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

export async function getArticleById(req: Request, res: Response) {
  try {
    const { articleId } = req.params;

    if (!articleId) return res.status(400).json({ message: "Article ID parameter not received" });

    if (!articleId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid listId" });
    }

    const article = await BackpackingArticle.findOne({ _id: articleId });
    // TODO: Deal with it if there's nothing found, or if the data is off or something
    res.json(article);

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error fetching backpacking article" });
  }
}