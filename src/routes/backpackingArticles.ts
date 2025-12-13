import { Router } from 'express';
import { getAllArticles, getArticleById } from '../controllers/backpackingArticlesController.js';

const router = Router();

router.get('/', getAllArticles);

router.get('/:articleId', getArticleById);

export default router;
