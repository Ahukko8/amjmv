/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import connectDB from '@/lib/db';
// import { Blog, Category } from '@/models';
// import { otherChannelBlogs, OtherCategory } from '@/models';
import OtherChannelBlog from '@/models/otherChannelsBlogs'
import { FilterQuery, isValidObjectId } from 'mongoose';

// Spaces configuration
const ENDPOINT = process.env.DO_SPACES_ENDPOINT || 'blr1.digitaloceanspaces.com';
const REGION = ENDPOINT.split('.')[0];
const s3Client = new S3Client({
  region: REGION,
  endpoint: `https://${ENDPOINT}`,
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY!,
    secretAccessKey: process.env.DO_SPACES_SECRET!,
  },
});

export async function GET(request: Request) {
  try {
    console.log('GET request received for /api/otherChannelBlogs');
    const { userId } = await auth();
    console.log('User ID from auth:', userId);
    const user = await currentUser();
    console.log('User object:', user);

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '6', 10);

    console.log('Connecting to DB...');
    await connectDB();
    console.log('DB connected');

    const query: FilterQuery<any> = {};
    if (!userId || user?.publicMetadata.role !== 'admin') {
      console.log('User is not admin or not authenticated, filtering published blogs');
      query.status = 'published';
    }
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (category) {
      query.categories = category;
    }

    const skip = (page - 1) * limit;
    console.log('Fetching blogs with query:', query);
    const [blogs, total] = await Promise.all([
      OtherChannelBlog.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('categories', 'name slug'),
      OtherChannelBlog.countDocuments(query),
    ]);

    console.log('Blogs fetched successfully:', blogs.length);
    return NextResponse.json({ blogs, total });
  } catch (error: any) {
    console.error('Error fetching blogs:', error.message, error.stack);
    return NextResponse.json(
      { message: 'Error fetching blogs', error: error.message },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.DO_SPACES_KEY || !process.env.DO_SPACES_SECRET || !process.env.DO_SPACES_BUCKET) {
      throw new Error('Spaces credentials or bucket not configured');
    }

    await connectDB();

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const fontFamily = formData.get('fontFamily') as string | null;
    const fontSize = formData.get('fontSize') as string | null;
    const categories = formData.get('categories') as string;
    const imageFile = formData.get('image') as File | null;

    if (!title || !content) {
      return NextResponse.json(
        { message: 'Title and content are required' },
        { status: 400 }
      );
    }

    let imageUrl: string | null = null;
    if (imageFile) {
      const imageFileName = `${Date.now()}-${imageFile.name}`;
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.DO_SPACES_BUCKET,
          Key: `blog-images/${imageFileName}`,
          Body: imageBuffer,
          ACL: 'public-read',
          ContentType: imageFile.type,
        })
      );
      imageUrl = `https://${process.env.DO_SPACES_BUCKET}.${ENDPOINT}/blog-images/${imageFileName}`;
    }

    const otherBlog = await  OtherChannelBlog.create({
      title,
      content,
      fontFamily: fontFamily || 'default',
      fontSize: fontSize || 'medium',
      // author: userId,
      status: 'draft',
      categories: categories ? JSON.parse(categories) : [],
      image: imageUrl,
    });

    const populatedBlog = await OtherChannelBlog.findById(otherBlog._id)
      .populate('categories', 'name slug');

    return NextResponse.json({ blog: populatedBlog }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { message: 'Error creating blog', error: error.toString() },
      { status: 500 }
    );
  }
}