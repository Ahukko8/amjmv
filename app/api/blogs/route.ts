/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/blogs/route.ts
import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import connectDB from '@/lib/db';
import { Blog, Category } from '@/models'; // Import both models
import { FilterQuery, isValidObjectId } from 'mongoose';
import { MongoDBBlog } from '@/types/mongodb';

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '6', 10);

    // Connect to database first
    await connectDB();

    // Verify models are registered
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    console.log('Available models:', Object.keys(require('mongoose').models));

    const query: FilterQuery<MongoDBBlog> = {};
    if (!userId || user?.publicMetadata.role !== 'admin') {
      query.status = 'published';
    }
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (category) {
      query.categories = category;
    }

    const skip = (page - 1) * limit;
    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'name')
        .populate('categories', 'name slug'),
      Blog.countDocuments(query),
    ]);

    return NextResponse.json({ blogs, total });
  } catch (error: any) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ 
      message: 'Error fetching blogs', 
      error: error.toString(),
      stack: error.stack || 'No stack trace'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, content, fontFamily, fontSize, categories } = body;

    if (!title || !content) {
      return NextResponse.json(
        { message: 'Title and content are required' },
        { status: 400 }
      );
    }

    if (categories && Array.isArray(categories)) {
      const invalidCategories = categories.some(
        (categoryId) => !isValidObjectId(categoryId)
      );
      if (invalidCategories) {
        return NextResponse.json(
          { message: 'Invalid category ID format' },
          { status: 400 }
        );
      }
    }

    // Connect to database
    await connectDB();

    const blog = await Blog.create({
      title,
      content,
      fontFamily: fontFamily || 'default',
      fontSize: fontSize || 'medium',
      author: userId,
      status: 'draft',
      categories: categories || [],
    });

    const populatedBlog = await Blog.findById(blog._id)
      .populate('author', 'name')
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