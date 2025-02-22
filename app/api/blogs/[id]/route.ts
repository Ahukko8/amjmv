import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import { isValidObjectId } from "mongoose";

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { id } = params;

    if (!isValidObjectId(id)) {
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
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ blog });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { message: "Error fetching blog" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { id } = params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid blog ID format" },
        { status: 400 }
      );
    }

    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = user.publicMetadata.role === "admin";
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const updates = await request.json();
    
    // Validate categories if they exist
    if (updates.categories && Array.isArray(updates.categories)) {
      const invalidCategories = updates.categories.some(
        (categoryId: string) => !isValidObjectId(categoryId)
      );
      if (invalidCategories) {
        return NextResponse.json(
          { message: "Invalid category ID format" },
          { status: 400 }
        );
      }
    }

    await connectDB();

    const blog = await Blog.findById(id);
    if (!blog) {
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

    return NextResponse.json({ blog: updatedBlog });
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { message: "Error updating blog" },
      { status: 500 }
    );
  }
}
export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { id } = params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid blog ID format" },
        { status: 400 }
      );
    }

    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = user.publicMetadata.role === "admin";
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { status } = await request.json();

    if (!["draft", "published"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status value" },
        { status: 400 }
      );
    }

    await connectDB();

    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    blog.status = status;
    await blog.save();

    return NextResponse.json(
      {
        message: `Blog ${status === "published" ? "published" : "unpublished"} successfully`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating blog status:", error);
    return NextResponse.json(
      { message: "Error updating blog status" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { id } = params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid blog ID format" },
        { status: 400 }
      );
    }

    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = user.publicMetadata.role === "admin";
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    await Blog.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Blog deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { message: "Error deleting blog" },
      { status: 500 }
    );
  }
}
