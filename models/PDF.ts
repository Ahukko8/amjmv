import mongoose, { Schema, model, Model, Document } from "mongoose";


// Define the PDF document interface
interface IPDF extends Document {
  title: string;
  description?: string;
  pdfFile: string; // URL to the uploaded PDF
  image?: string; // URL to preview image
  author: string; // Clerk userId
  category: mongoose.Schema.Types.ObjectId; // Reference to Category
  createdAt: Date;
  updatedAt: Date;
}

const pdfSchema = new Schema<IPDF>(
  {
    title: { type: String, required: true },
    description: { type: String, default: undefined },
    pdfFile: { type: String, required: true }, // URL to the uploaded PDF
    image: { type: String, default: undefined }, // URL to preview image
    author: { type: String, required: true }, // Clerk userId
    category: { 
      type: Schema.Types.ObjectId, 
      ref: 'Category', 
      required: true 
    }, // Reference to Category
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true } // Automatically manages createdAt/updatedAt
);

// Export the model with TypeScript typing
const PDF: Model<IPDF> = mongoose.models.PDF || model<IPDF>("PDF", pdfSchema);
export default PDF;