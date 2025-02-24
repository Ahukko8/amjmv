import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import { isValidObjectId } from "mongoose";
import { FilterQuery } from "mongoose";
import { MongoDBBlog } from "@/types/mongodb";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '6', 10);

    await connectDB();

    // Base query with proper typing
    const query: FilterQuery<MongoDBBlog> = {};

    // Restrict to published blogs for non-admins
    if (!userId || user?.publicMetadata.role !== 'admin') {
      query.status = 'published';
    }

    // Add search condition if search term exists
    if (search) {
      query.title = {
        $regex: search,
        $options: 'i', // case-insensitive
      };
    }

    // Add category filter if provided
    if (category && isValidObjectId(category)) {
      query.categories = category;
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Fetch paginated blogs and total count
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
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { message: 'Error fetching blogs' },
      { status: 500 }
    );
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
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { message: 'Error creating blog' },
      { status: 500 }
    );
  }
}