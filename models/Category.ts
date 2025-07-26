
import  { Schema, model, models } from 'mongoose';

const categorySchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create slug from name before saving, supporting Thaana script
categorySchema.pre('save', function(next) {
  if (!this.isModified('name') && this.slug) {
    return next(); // Skip if name unchanged and slug exists
  }

  if (this.name) {
    let slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\u0780-\u07BF]/g, '-') // Include Thaana unicode range
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Prevent empty slugs
    if (!slug) {
      slug = `category-${Date.now()}`; // Fallback to ensure uniqueness
    }

    this.slug = slug;
  }
  next();
});

const Category = models.Category || model('Category', categorySchema);

export default Category;