import mongoose, { Schema } from 'mongoose';

const pdfSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  pdfFile: { type: String, required: true }, // URL to the uploaded PDF
  image: { type: String }, // URL to preview image
  author: { type: String, required: true }, // Clerk userId
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.PDF || mongoose.model('PDF', pdfSchema);