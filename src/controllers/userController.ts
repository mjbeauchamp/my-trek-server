import type { Request, Response} from 'express'
import User from "../models/User";

export async function getUser(req: Request, res: Response) {
  try {
    const articles = await User.find();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}