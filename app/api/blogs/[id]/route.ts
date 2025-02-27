/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import Category from "@/models/Category";
import { isValidObjectId } from "mongoose";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Await params
  try {
    console.log('GET /api/blogs/[id] - ID:', id);

    if (!isValidObjectId(id)) {
      console.log('Invalid blog ID format:', id);
      return NextResponse.json(
        { message: "Invalid blog ID format" },
        { status: 400 }
      );
    }

    await connectDB();
    const blog = await Blog.findById(id)
      .populate('author', 'name')
      .populate('categories', 'name slug');

    if (!blog) {
      console.log('Blog not found for ID:', id);
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    console.log('Blog fetched successfully:', blog._id);
    return NextResponse.json({ blog });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error fetching blog:", errorMessage);
    return NextResponse.json(
      { message: "Error fetching blog", error: errorMessage },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Await params
  try {
    console.log('PATCH /api/blogs/[id] - ID:', id);

    if (!isValidObjectId(id)) {
      console.log('Invalid blog ID format:', id);
      return NextResponse.json(
        { message: "Invalid blog ID format" },
        { status: 400 }
      );
    }

    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      console.log('Unauthorized: No user ID or user data');
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = user.publicMetadata.role === "admin";
    if (!isAdmin) {
      console.log('Forbidden: User is not admin');
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const updates = await request.json();
    console.log('PATCH updates:', updates);

    if (!updates || Object.keys(updates).length === 0) {
      console.log('No updates provided');
      return NextResponse.json(
        { message: "No updates provided" },
        { status: 400 }
      );
    }

    // Normalize categories to array of IDs
    if (updates.categories && Array.isArray(updates.categories)) {
      const normalizedCategories = updates.categories.map((cat: any) =>
        typeof cat === 'string' ? cat : cat._id
      );
      const invalidCategories = normalizedCategories.some(
        (categoryId: string) => !isValidObjectId(categoryId)
      );
      if (invalidCategories) {
        console.log('Invalid category ID format in updates:', normalizedCategories);
        return NextResponse.json(
          { message: "Invalid category ID format" },
          { status: 400 }
        );
      }
      updates.categories = normalizedCategories; // Replace with normalized IDs
    }

    await connectDB();

    const blog = await Blog.findById(id);
    if (!blog) {
      console.log('Blog not found for ID:', id);
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        ...updates,
        author: userId,
      },
      { new: true, runValidators: true }
    )
      .populate('author', 'name')
      .populate('categories', 'name slug');

    console.log('Blog updated successfully:', updatedBlog._id);
    return NextResponse.json({ blog: updatedBlog });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error updating blog:", errorMessage);
    return NextResponse.json(
      { message: "Error updating blog", error: errorMessage },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Await params
  try {
    console.log('PUT /api/blogs/[id] - ID:', id);

    if (!isValidObjectId(id)) {
      console.log('Invalid blog ID format:', id);
      return NextResponse.json(
        { message: "Invalid blog ID format" },
        { status: 400 }
      );
    }

    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      console.log('Unauthorized: No user ID or user data');
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = user.publicMetadata.role === "admin";
    if (!isAdmin) {
      console.log('Forbidden: User is not admin');
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    console.log('PUT body:', body);

    const { status } = body;
    if (!status || !["draft", "published"].includes(status)) {
      console.log('Invalid or missing status:', status);
      return NextResponse.json(
        { message: "Invalid or missing status value" },
        { status: 400 }
      );
    }

    await connectDB();

    const blog = await Blog.findById(id);
    if (!blog) {
      console.log('Blog not found for ID:', id);
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    blog.status = status;
    await blog.save();

    console.log(`Blog status updated to ${status} for ID:`, id);
    return NextResponse.json(
      {
        message: `Blog ${status === "published" ? "published" : "unpublished"} successfully`,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error updating blog status:", errorMessage);
    return NextResponse.json(
      { message: "Error updating blog status", error: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Await params
  try {
    console.log('DELETE /api/blogs/[id] - ID:', id);

    if (!isValidObjectId(id)) {
      console.log('Invalid blog ID format:', id);
      return NextResponse.json(
        { message: "Invalid blog ID format" },
        { status: 400 }
      );
    }

    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      console.log('Unauthorized: No user ID or user data');
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = user.publicMetadata.role === "admin";
    if (!isAdmin) {
      console.log('Forbidden: User is not admin');
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    const blog = await Blog.findById(id);
    if (!blog) {
      console.log('Blog not found for ID:', id);
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    await Blog.findByIdAndDelete(id);

    console.log('Blog deleted successfully for ID:', id);
    return NextResponse.json(
      { message: "Blog deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error deleting blog:", errorMessage);
    return NextResponse.json(
      { message: "Error deleting blog", error: errorMessage },
      { status: 500 }
    );
  }
}