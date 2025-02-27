import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import connectDB from '@/lib/db';
import PDF from '@/models/PDF';

// Configure S3 client for DigitalOcean Spaces
const s3Client = new S3Client({
  region: 'us-east-1', // Must be 'us-east-1' for S3 compatibility
  endpoint: `https://${process.env.DO_SPACES_ENDPOINT}`,
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY!,
    secretAccessKey: process.env.DO_SPACES_SECRET!,
  },
});

// No bodyParser config needed since we’re handling FormData directly
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

    if (!title || !pdfFile) {
      return NextResponse.json({ message: 'Title and PDF file required' }, { status: 400 });
    }

    // Upload PDF to DigitalOcean Spaces
    const pdfFileName = `${Date.now()}-${pdfFile.name}`;
    const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.DO_SPACES_BUCKET,
        Key: pdfFileName,
        Body: pdfBuffer,
        ACL: 'public-read', // Publicly accessible PDFs
        ContentType: pdfFile.type,
      })
    );
    const pdfUrl = `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_ENDPOINT}/${pdfFileName}`;

    // Upload image (if provided)
    let imageUrl: string | null = null;
    if (imageFile) {
      const imageFileName = `${Date.now()}-${imageFile.name}`;
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.DO_SPACES_BUCKET,
          Key: imageFileName,
          Body: imageBuffer,
          ACL: 'public-read',
          ContentType: imageFile.type,
        })
      );
      imageUrl = `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_ENDPOINT}/${imageFileName}`;
    }

    // Save PDF metadata to MongoDB
    const pdfDoc = await PDF.create({
      title,
      description,
      pdfFile: pdfUrl,
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

