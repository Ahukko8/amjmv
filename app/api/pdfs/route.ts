import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { put } from '@vercel/blob';
import connectDB from '@/lib/db';
import PDF from '@/models/PDF';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1000mb',
    },
  },
};

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

    if (!title || !pdfFile || pdfFile.type !== 'application/pdf') {
      return NextResponse.json({ message: 'Title and valid PDF required' }, { status: 400 });
    }

    const pdfBlob = await put(`${Date.now()}-${pdfFile.name}`, pdfFile, { access: 'public' });
    let imageUrl: string | null = null;
    if (imageFile) {
      const imageBlob = await put(`${Date.now()}-${imageFile.name}`, imageFile, { access: 'public' });
      imageUrl = imageBlob.url;
    }

    const pdfDoc = await PDF.create({
      title,
      description,
      pdfFile: pdfBlob.url,
      image: imageUrl,
      author: userId,
    });

    const populatedPDF = await PDF.findById(pdfDoc._id).populate('author', 'name');
    return NextResponse.json({ pdf: populatedPDF }, { status: 201 });
  } catch (error) {
    console.error('Error creating PDF:', error);
    return NextResponse.json({ message: 'Error creating PDF' }, { status: 500 });
  }
}

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

