import { Router } from "express";
import {getAllArticles} from "../controllers/backpackingArticlesController";

const router = Router();

// Fetch all Backpacking 101 articles 
router.get("/", getAllArticles);

export default router;