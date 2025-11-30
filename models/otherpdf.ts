import mongoose, { Schema, model, Model, Document } from "mongoose";

// Define the PDF document interface
interface OIPDF extends Document {
  title: string;
  description?: string;
  categories: any;
  pdfFile: string; // URL to the uploaded PDF
  image?: string; // URL to preview image
  createdAt: Date;
  updatedAt: Date;
}

const otherpdfSchema = new Schema<OIPDF>(
  {
    title: { type: String, required: true },
    description: { type: String, default: undefined },
    pdfFile: { type: String, required: true }, // URL to the uploaded PDF
    image: { type: String, default: undefined }, // URL to preview image
    categories: [{ type: Schema.Types.ObjectId, ref: 'othercategories' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true } // Automatically manages createdAt/updatedAt
);


const OtherPDF: Model<OIPDF> = mongoose.models.otherPDF || model<OIPDF>("otherPDF", otherpdfSchema);
export default OtherPDF;