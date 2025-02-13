// types/mongodb.ts
import { Types } from 'mongoose';

export interface MongoDBAuthor {
  _id?: Types.ObjectId;
  name?: string;
}

export interface MongoDBBlog {
  _id: Types.ObjectId;
  title: string;
  content: string;
  author?: MongoDBAuthor;
  status: 'draft' | 'published';
  featured: boolean;
  fontFamily?: string;
  fontSize?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
