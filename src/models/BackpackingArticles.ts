import mongoose, { Schema, Document } from "mongoose";

export interface IBackpackingArticle extends Document {
  title: string;
  author: string;
  date: string;
  image: string;
  content: string[];
}

const BackpackingArticleSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: String, required: true },
    image: { type: String, required: true },
    content: { type: [String], required: true },
  },
  { collection: "backpackingArticles" }
);

export default mongoose.model<IBackpackingArticle>("BackpackingArticle", BackpackingArticleSchema);