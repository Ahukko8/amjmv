/* eslint-disable @typescript-eslint/no-unused-vars */

import mongoose, { models, model, Schema } from 'mongoose';

// Define the schema
const otherChannelsBlogSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  categories: [{ type: Schema.Types.ObjectId, ref: 'othercategories' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  fontFamily: { type: String, default: 'default' },
  fontSize: { type: String, default: 'medium' },
  image: { type: String, default: null },
});

// Export the model, ensuring it’s only compiled once
const OtherChannelBlog = models.OtherChannelBlog || model('OtherChannelBlog', otherChannelsBlogSchema);
export default OtherChannelBlog;