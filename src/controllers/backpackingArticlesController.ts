import type { Request, Response } from 'express';
import BackpackingArticle from '../models/BackpackingArticle.js';

export async function getAllArticles(req: Request, res: Response) {
    try {
        const articles = await BackpackingArticle.find();

        if (!articles) {
            return res.status(404).json({ message: 'Article list not found' });
        }

        if (!Array.isArray(articles)) {
            console.error('Article list data is in an unexpected format');
            return res
                .status(500)
                .json({ message: 'Article list data is in an unexpected format' });
        }

        res.json(articles);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching backpacking articles' });
    }
}

export async function getArticleById(req: Request, res: Response) {
    try {
        const { articleId } = req.params;

        if (!articleId)
            return res.status(400).json({ message: 'Article ID parameter not received' });

        if (!articleId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: 'Invalid listId' });
        }

        const article = await BackpackingArticle.findOne({ _id: articleId });

        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        res.json(article);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching backpacking article' });
    }
}
