import mongoose, { Schema, Document } from 'mongoose';

export interface IBackpackingArticle extends Document {
    title: string;
    tagline: string;
    author: string;
    imageUrl: string;
    imageAlt: string;
    content: string[];
}

const BackpackingArticleSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        tagline: { type: String, required: true },
        author: { type: String, required: true },
        imageUrl: { type: String, required: true },
        imageAlt: { type: String, required: true },
        content: { type: [String], required: true },
    },
    { collection: 'backpackingArticles' },
);

export default mongoose.model<IBackpackingArticle>('BackpackingArticle', BackpackingArticleSchema);
