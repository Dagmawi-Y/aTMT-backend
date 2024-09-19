import { Schema, Document } from 'mongoose';

export const BlogSchema = new Schema({
  title: String,
  image: String,
  category: String,
  content: String,
});

export interface Blog {
  title: string;
  image: string;
  category: string;
  content: string;
}

export type BlogDocument = Blog & Document;
