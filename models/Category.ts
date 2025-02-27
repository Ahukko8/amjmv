/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose, { Schema, model, models } from 'mongoose';

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

const Category = models.Category || model('Category', categorySchema);

export default Category;