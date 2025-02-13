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