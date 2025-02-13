/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/blogs/route.ts (not inside auth folder)
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    
    await connectDB();

    // If admin user, return all blogs. Otherwise return only published blogs
    if (userId && user?.publicMetadata.role === 'admin') {
      const blogs = await Blog.find().sort({ createdAt: -1 }).populate('author', 'name');
      return NextResponse.json({ blogs });
    } else {
      const blogs = await Blog.find({ status: 'published' })
        .sort({ createdAt: -1 })
        .populate('author', 'name');
      return NextResponse.json({ blogs });
    }
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { message: "Error fetching blogs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Add error handling for auth
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Validate request body
    const body = await request.json();
    const { title, content, fontFamily, fontSize } = body;

    if (!title || !content) {
      return NextResponse.json(
        { message: "Title and content are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const blog = await Blog.create({
      title,
      content,
      fontFamily: fontFamily || 'default',
      fontSize: fontSize || 'medium',
      author: userId,
      status: 'draft',
    });

    return NextResponse.json({ blog }, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { message: "Error creating blog" },
      { status: 500 }
    );
  }
}