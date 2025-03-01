/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose, { Schema, model, models } from 'mongoose';
import './Category'; // Import to ensure Category model is registered

const blogSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String },
  fontFamily: { type: String, default: 'default' },
  fontSize: { type: String, default: 'medium', enum: ['small', 'medium', 'large'] },
  author: { type: String, required: true },
  status: { type: String, default: 'draft', enum: ['draft', 'published'] },
  image: { type: String },
  categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Blog = models.Blog || model('Blog', blogSchema);

export default Blog;