import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import connectDB from '@/lib/db';
import PDF from '@/models/PDF';
import fs from 'fs/promises';
import path from 'path';


export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1000mb',
    },
  },
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connectDB();
    const pdf = await PDF.findById(id).populate('author', 'name');
    if (!pdf) {
      return NextResponse.json({ message: 'PDF not found' }, { status: 404 });
    }
    return NextResponse.json({ pdf });
  } catch (error) {
    console.error('Error fetching PDF:', error);
    return NextResponse.json({ message: 'Error fetching PDF' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Type params as a Promise
) {
  const { id } = await params; // Await params to resolve the id
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

    const existingPDF = await PDF.findById(id);
    if (!existingPDF) {
      return NextResponse.json({ message: 'PDF not found' }, { status: 404 });
    }

    const uploadDir = path.join(process.cwd(), 'public/uploads/pdfs');
    await fs.mkdir(uploadDir, { recursive: true });

    let pdfPath = existingPDF.pdfFile;
    if (pdfFile) {
      const pdfFileName = `${Date.now()}-${pdfFile.name}`;
      pdfPath = `/uploads/pdfs/${pdfFileName}`;
      const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
      await fs.writeFile(path.join(uploadDir, pdfFileName), pdfBuffer);
      if (existingPDF.pdfFile) {
        await fs.unlink(path.join(process.cwd(), 'public', existingPDF.pdfFile)).catch(() => {});
      }
    }

    let imagePath = existingPDF.image;
    if (imageFile) {
      const imageFileName = `${Date.now()}-${imageFile.name}`;
      imagePath = `/uploads/pdfs/${imageFileName}`;
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      await fs.writeFile(path.join(uploadDir, imageFileName), imageBuffer);
      if (existingPDF.image) {
        await fs.unlink(path.join(process.cwd(), 'public', existingPDF.image)).catch(() => {});
      }
    }

    const updatedPDF = await PDF.findByIdAndUpdate(
      id,
      { title, description, pdfFile: pdfPath, image: imagePath, updatedAt: new Date() },
      { new: true }
    ).populate('author', 'name');

    return NextResponse.json({ pdf: updatedPDF });
  } catch (error) {
    console.error('Error updating PDF:', error);
    return NextResponse.json({ message: 'Error updating PDF' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Type params as a Promise
) {
  const { id } = await params; // Await params to resolve the id
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user || user.publicMetadata.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const pdf = await PDF.findById(id);
    if (!pdf) {
      return NextResponse.json({ message: 'PDF not found' }, { status: 404 });
    }

    if (pdf.pdfFile) {
      await fs.unlink(path.join(process.cwd(), 'public', pdf.pdfFile)).catch(() => {});
    }
    if (pdf.image) {
      await fs.unlink(path.join(process.cwd(), 'public', pdf.image)).catch(() => {});
    }

    await PDF.findByIdAndDelete(id);

    return NextResponse.json({ message: 'PDF deleted successfully' });
  } catch (error) {
    console.error('Error deleting PDF:', error);
    return NextResponse.json({ message: 'Error deleting PDF' }, { status: 500 });
  }
}