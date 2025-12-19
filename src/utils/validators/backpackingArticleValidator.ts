import { IBackpackingArticle } from '../../models/BackpackingArticle.js';

export function isArticle(item: IBackpackingArticle) {
    return (
        typeof item === 'object' &&
        item !== null &&
        typeof item.title === 'string' &&
        typeof item.tagline === 'string' &&
        typeof item.author === 'string' &&
        typeof item.imageUrl === 'string' &&
        typeof item.imageAlt === 'string' &&
        Array.isArray(item.content) &&
        item.content.every((paragraph) => typeof paragraph === 'string')
    );
}

export function isArrayOfArticles(articleArray: unknown) {
    if (!articleArray || !Array.isArray(articleArray)) {
        return false;
    }

    return articleArray.every((article: any) => {
        return isArticle(article);
    });
}
