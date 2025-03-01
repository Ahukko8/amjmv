/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose, { Schema } from 'mongoose';

// Define all schemas here
const categorySchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create slug from name before saving
categorySchema.pre('save', function(next) {
  if (this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

const blogSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String },
  fontFamily: { type: String, default: 'default' },
  fontSize: { type: String, default: 'medium', enum: ['small', 'medium', 'large'] },
  author: { type: String, required: true },
  image: { type: String },
  status: { type: String, default: 'draft', enum: ['draft', 'published'] },
  categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});