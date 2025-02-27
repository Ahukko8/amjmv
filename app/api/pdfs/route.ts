import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import connectDB from '@/lib/db';
import PDF from '@/models/PDF';

// Consistent Spaces configuration
const ENDPOINT = process.env.DO_SPACES_ENDPOINT || 'blr1.digitaloceanspaces.com';
const REGION = ENDPOINT.split('.')[0]; // e.g., 'nyc3'
console.log('Using Spaces endpoint:', `https://${ENDPOINT}`);
console.log('Using Spaces region:', REGION);

const s3Client = new S3Client({
  region: REGION,
  endpoint: `https://${ENDPOINT}`,
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY!,
    secretAccessKey: process.env.DO_SPACES_SECRET!,
  },
});

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    console.log('POST /api/pdfs - User:', userId, 'Role:', user?.publicMetadata.role);

    if (!userId || !user || user.publicMetadata.role !== 'admin') {
      console.log('Unauthorized access attempt');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.DO_SPACES_KEY || !process.env.DO_SPACES_SECRET || !process.env.DO_SPACES_BUCKET) {
      console.error('Missing Spaces configuration');
      throw new Error('Spaces credentials or bucket not configured');
    }
    console.log('Spaces bucket:', process.env.DO_SPACES_BUCKET);

    await connectDB();
    console.log('Database connected');

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string | null;
    const pdfFile = formData.get('pdfFile') as File | null;
    const imageFile = formData.get('image') as File | null;
    console.log('Form data:', { title, description, pdfFile: pdfFile?.name, imageFile: imageFile?.name });

    if (!title || !pdfFile) {
      console.log('Missing title or PDF file');
      return NextResponse.json({ message: 'Title and PDF file required' }, { status: 400 });
    }

    const pdfFileName = `${Date.now()}-${pdfFile.name}`;
    const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
    console.log('Uploading PDF to Spaces:', pdfFileName);
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.DO_SPACES_BUCKET,
        Key: pdfFileName,
        Body: pdfBuffer,
        ACL: 'public-read',
        ContentType: pdfFile.type,
      })
    );
    const pdfUrl = `https://${process.env.DO_SPACES_BUCKET}.${ENDPOINT}/${pdfFileName}`;
    console.log('PDF uploaded:', pdfUrl);

    let imageUrl: string | null = null;
    if (imageFile) {
      const imageFileName = `${Date.now()}-${imageFile.name}`;
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      console.log('Uploading image to Spaces:', imageFileName);
      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.DO_SPACES_BUCKET,
          Key: imageFileName,
          Body: imageBuffer,
          ACL: 'public-read',
          ContentType: imageFile.type,
        })
      );
      imageUrl = `https://${process.env.DO_SPACES_BUCKET}.${ENDPOINT}/${imageFileName}`;
      console.log('Image uploaded:', imageUrl);
    }

    const pdfDoc = await PDF.create({
      title,
      description: description || undefined,
      pdfFile: pdfUrl,
      image: imageUrl,
      author: userId,
    });
    console.log('PDF saved to MongoDB:', pdfDoc._id);

    const populatedPDF = await PDF.findById(pdfDoc._id).populate('author', 'name');
    return NextResponse.json({ pdf: populatedPDF }, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error creating PDF:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      details: error,
    });
    return NextResponse.json({ message: 'Error creating PDF', error: errorMessage }, { status: 500 });
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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching PDFs:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      details: error,
    });
    return NextResponse.json({ message: 'Error fetching PDFs', error: errorMessage }, { status: 500 });
  }
}