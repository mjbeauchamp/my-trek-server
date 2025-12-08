import { Router } from "express";
import {getAllArticles, getArticleById} from "../controllers/backpackingArticlesController";

const router = Router();

// Fetch all Backpacking 101 articles 
router.get("/", getAllArticles);

// Get article by ID
router.get("/:articleId", getArticleById);

export default router;