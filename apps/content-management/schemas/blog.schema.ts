import { Schema, Document } from 'mongoose';

export const BlogSchema = new Schema(
  {
    title: String,
    image: String,
    category: String,
    subCategory: String,
    content: String,
  },
  { timestamps: true },
);

export interface Blog {
  title: string;
  image: string;
  category: string;
  subCategory: string;
  content: string;
}

export type BlogDocument = Blog & Document;
