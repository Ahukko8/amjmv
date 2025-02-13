// models/Blog.ts
import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String, // Changed from ObjectId to String for Clerk userId
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
  featured: {
    type: Boolean,
    default: false
  },
  fontFamily: {
    type: String,
    default: 'default',
  },
  fontSize: {
    type: String,
    default: 'medium',
  },
}, {
  timestamps: true,
});

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);

export default Blog;