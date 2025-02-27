import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
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

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await connectDB();
    const pdf = await PDF.findById(id).populate('author', 'name');
    if (!pdf) {
      console.log('PDF not found for ID:', id);
      return NextResponse.json({ message: 'PDF not found' }, { status: 404 });
    }
    console.log('PDF fetched successfully:', id);
    return NextResponse.json({ pdf });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching PDF:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      details: error,
    });
    return NextResponse.json({ message: 'Error fetching PDF', error: errorMessage }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user || user.publicMetadata.role !== 'admin') {
      console.log('Unauthorized: No user ID or admin role');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.DO_SPACES_KEY || !process.env.DO_SPACES_SECRET || !process.env.DO_SPACES_BUCKET) {
      console.error('Missing Spaces configuration');
      throw new Error('Spaces credentials or bucket not configured');
    }

    await connectDB();

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string | null;
    const pdfFile = formData.get('pdfFile') as File | null;
    const imageFile = formData.get('image') as File | null;
    console.log('PUT form data:', { title, description, pdfFile: pdfFile?.name, imageFile: imageFile?.name });

    if (!title) {
      console.log('Missing title');
      return NextResponse.json({ message: 'Title is required' }, { status: 400 });
    }

    const existingPDF = await PDF.findById(id);
    if (!existingPDF) {
      console.log('PDF not found for ID:', id);
      return NextResponse.json({ message: 'PDF not found' }, { status: 404 });
    }

    let pdfPath = existingPDF.pdfFile;
    if (pdfFile) {
      const pdfFileName = `${Date.now()}-${pdfFile.name}`;
      const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
      console.log('Uploading new PDF to Spaces:', pdfFileName);
      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.DO_SPACES_BUCKET,
          Key: pdfFileName,
          Body: pdfBuffer,
          ACL: 'public-read',
          ContentType: pdfFile.type,
        })
      );
      pdfPath = `https://${process.env.DO_SPACES_BUCKET}.${ENDPOINT}/${pdfFileName}`;
      if (existingPDF.pdfFile) {
        const oldPdfKey = existingPDF.pdfFile.split('/').pop();
        console.log('Deleting old PDF from Spaces:', oldPdfKey);
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: process.env.DO_SPACES_BUCKET,
            Key: oldPdfKey,
          })
        );
      }
    }

    let imagePath = existingPDF.image;
    if (imageFile) {
      const imageFileName = `${Date.now()}-${imageFile.name}`;
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      console.log('Uploading new image to Spaces:', imageFileName);
      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.DO_SPACES_BUCKET,
          Key: imageFileName,
          Body: imageBuffer,
          ACL: 'public-read',
          ContentType: imageFile.type,
        })
      );
      imagePath = `https://${process.env.DO_SPACES_BUCKET}.${ENDPOINT}/${imageFileName}`;
      if (existingPDF.image) {
        const oldImageKey = existingPDF.image.split('/').pop();
        console.log('Deleting old image from Spaces:', oldImageKey);
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: process.env.DO_SPACES_BUCKET,
            Key: oldImageKey,
          })
        );
      }
    }

    const updatedPDF = await PDF.findByIdAndUpdate(
      id,
      { title, description: description || undefined, pdfFile: pdfPath, image: imagePath, updatedAt: new Date() },
      { new: true }
    ).populate('author', 'name');

    console.log('PDF updated successfully:', id);
    return NextResponse.json({ pdf: updatedPDF });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error updating PDF:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      details: error,
    });
    return NextResponse.json({ message: 'Error updating PDF', error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user || user.publicMetadata.role !== 'admin') {
      console.log('Unauthorized: No user ID or admin role');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const pdf = await PDF.findById(id);
    if (!pdf) {
      console.log('PDF not found for ID:', id);
      return NextResponse.json({ message: 'PDF not found' }, { status: 404 });
    }

    if (pdf.pdfFile) {
      const pdfKey = pdf.pdfFile.split('/').pop();
      console.log('Deleting PDF from Spaces:', pdfKey);
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.DO_SPACES_BUCKET,
          Key: pdfKey,
        })
      );
    }

    if (pdf.image) {
      const imageKey = pdf.image.split('/').pop();
      console.log('Deleting image from Spaces:', imageKey);
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.DO_SPACES_BUCKET,
          Key: imageKey,
        })
      );
    }

    await PDF.findByIdAndDelete(id);
    console.log('PDF deleted successfully from DB:', id);

    return NextResponse.json({ message: 'PDF deleted successfully' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error deleting PDF:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      details: error,
    });
    return NextResponse.json({ message: 'Error deleting PDF', error: errorMessage }, { status: 500 });
  }
}