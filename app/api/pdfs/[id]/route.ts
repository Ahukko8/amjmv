import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { put, del } from '@vercel/blob';
import connectDB from '@/lib/db';
import PDF from '@/models/PDF';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1000mb',
    },
  },
};

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await connectDB();
    const pdf = await PDF.findById(id).populate('author', 'name');
    if (!pdf) return NextResponse.json({ message: 'PDF not found' }, { status: 404 });
    return NextResponse.json({ pdf });
  } catch (error) {
    console.error('Error fetching PDF:', error);
    return NextResponse.json({ message: 'Error fetching PDF' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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

    if (!title) return NextResponse.json({ message: 'Title is required' }, { status: 400 });

    const existingPDF = await PDF.findById(id);
    if (!existingPDF) return NextResponse.json({ message: 'PDF not found' }, { status: 404 });

    let pdfPath = existingPDF.pdfFile;
    if (pdfFile) {
      const pdfBlob = await put(`${Date.now()}-${pdfFile.name}`, pdfFile, { access: 'public' });
      pdfPath = pdfBlob.url;
      if (existingPDF.pdfFile) await del(existingPDF.pdfFile);
    }

    let imagePath = existingPDF.image;
    if (imageFile) {
      const imageBlob = await put(`${Date.now()}-${imageFile.name}`, imageFile, { access: 'public' });
      imagePath = imageBlob.url;
      if (existingPDF.image) await del(existingPDF.image);
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

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user || user.publicMetadata.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const pdf = await PDF.findById(id);
    if (!pdf) return NextResponse.json({ message: 'PDF not found' }, { status: 404 });

    if (pdf.pdfFile) await del(pdf.pdfFile);
    if (pdf.image) await del(pdf.image);

    await PDF.findByIdAndDelete(id);

    return NextResponse.json({ message: 'PDF deleted successfully' });
  } catch (error) {
    console.error('Error deleting PDF:', error);
    return NextResponse.json({ message: 'Error deleting PDF' }, { status: 500 });
  }
}