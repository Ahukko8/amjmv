import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import connectDB from '@/lib/db';
import PDF from '@/models/PDF';
import fs from 'fs/promises';
import path from 'path';
import { PDFDocument } from 'pdf-lib';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1000mb', // Adjust as needed
    },
  },
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '6', 10);

    await connectDB();

    const skip = (page - 1) * limit;
    const [pdfs, total] = await Promise.all([
      PDF.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'name'),
      PDF.countDocuments({}),
    ]);

    return NextResponse.json({ pdfs, total });
  } catch (error) {
    console.error('Error fetching PDFs:', error);
    return NextResponse.json({ message: 'Error fetching PDFs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user || user.publicMetadata.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const pdfFile = formData.get('pdfFile') as File | null;
    const imageFile = formData.get('image') as File | null;

    if (!title) {
      return NextResponse.json({ message: 'Title is required' }, { status: 400 });
    }
    if (!pdfFile || pdfFile.type !== 'application/pdf') {
      return NextResponse.json({ message: 'A valid PDF file is required' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public/uploads/pdfs');
    await fs.mkdir(uploadDir, { recursive: true });

    const pdfFileName = `${Date.now()}-${pdfFile.name}`;
    const pdfPath = path.join(uploadDir, pdfFileName);
    const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
    await fs.writeFile(pdfPath, pdfBuffer);

    // Verify the file is a valid PDF
    try {
      const pdfBytes = await fs.readFile(pdfPath);
      await PDFDocument.load(pdfBytes); // Test parsing
    } catch (err) {
      await fs.unlink(pdfPath); // Clean up invalid file
      return NextResponse.json({ message: 'Uploaded file is not a valid PDF' , err}, { status: 400 });
    }

    let imagePath: string | null = null;
    if (imageFile) {
      const imageFileName = `${Date.now()}-${imageFile.name}`;
      const imagePathFull = path.join(uploadDir, imageFileName);
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      await fs.writeFile(imagePathFull, imageBuffer);
      imagePath = `/uploads/pdfs/${imageFileName}`;
    }

    const pdfDoc = await PDF.create({
      title,
      description,
      pdfFile: `/uploads/pdfs/${pdfFileName}`,
      image: imagePath,
      author: userId,
    });

    const populatedPDF = await PDF.findById(pdfDoc._id).populate('author', 'name');

    return NextResponse.json({ pdf: populatedPDF }, { status: 201 });
  } catch (error) {
    console.error('Error creating PDF:', error);
    return NextResponse.json({ message: 'Error creating PDF' }, { status: 500 });
  }
}