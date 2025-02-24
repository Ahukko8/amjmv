import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { put } from '@vercel/blob';
import connectDB from '@/lib/db';
import PDF from '@/models/PDF';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user || user.publicMetadata.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { title, description, pdfFileName, imageFileName } = await request.json();

    if (!title || !pdfFileName) {
      return NextResponse.json({ message: 'Title and PDF file name required' }, { status: 400 });
    }

    // Generate presigned URLs for client-side upload
    const pdfBlob = await put(pdfFileName, '', { access: 'public', token: process.env.BLOB_READ_WRITE_TOKEN, addRandomSuffix: false });
    let imageUrl: string | null = null;
    if (imageFileName) {
      const imageBlob = await put(imageFileName, '', { access: 'public', token: process.env.BLOB_READ_WRITE_TOKEN, addRandomSuffix: false });
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
    return NextResponse.json({ pdf: populatedPDF, pdfUploadUrl: pdfBlob.url, imageUploadUrl: imageUrl || undefined });
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

