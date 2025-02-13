// types/mongodb.ts
// import { Types } from 'mongoose';

// export interface MongoDBBlog {
//   _id: Types.ObjectId;
//   title: string;
//   content: string;
//   author: string; // This is now a string (Clerk userId)
//   status: 'draft' | 'published';
//   fontFamily?: string;
//   fontSize?: string;
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// types/blog.ts
export interface Author {
  _id: string;
  name: string;
}

export interface Blog {
  _id: string;
  title: string;
  content: string;
  author: Author;
  status: 'draft' | 'published';
  fontFamily: string;
  fontSize: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}