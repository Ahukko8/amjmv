import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
// import Category from "@/models/Category";
// import  OtherCategory  from "@/models/OtherCategory";
import Blog from "@/models/Blog";
import { isValidObjectId } from "mongoose";
import OtherCategory from "@/models/othercategories";


export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user || user.publicMetadata.role !== 'admin') {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid category ID" },
        { status: 400 }
      );
    }

    await connectDB();

    // Remove this category from all blogs that reference it
    await Blog.updateMany(
      { categories: id },
      { $pull: { categories: id } }
    );

    const deletedCategory = await OtherCategory.findByIdAndDelete(id);

    if (!deletedCategory) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { message: "Error deleting category" },
      { status: 500 }
    );
  }
}