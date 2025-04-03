/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import OtherCategory from "@/models/OtherCategory";



export async function GET() {
  try {
    await connectDB();
    const categories = await OtherCategory.find().sort({ name: 1 });
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { message: "Error fetching categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user || user.publicMetadata.role !== 'admin') {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name } = await request.json();
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { message: "Category name is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();
    await connectDB();

    // Check for existing category with the same name
    const existingCategory = await OtherCategory.findOne({ name: trimmedName });
    if (existingCategory) {
      return NextResponse.json(
        { message: "A category with this name already exists" },
        { status: 400 }
      );
    }

    // Generate slug as a fallback in case pre('save') fails
    let slug = trimmedName
      .toLowerCase()
      .replace(/[^a-z0-9\u0780-\u07BF]/g, '-') // Support Thaana characters
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    if (!slug) {
      slug = `category-${Date.now()}`; // Ensure slug is never empty
    }

    const category = await  OtherCategory.create({ 
      name: trimmedName,
      slug // Explicitly pass slug as a fallback
    });
    
    return NextResponse.json({ category }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating category:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "A category with this name or slug already exists" },
        { status: 400 }
      );
    }
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { message: "Category validation failed", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Error creating category", error: error.toString() },
      { status: 500 }
    );
  }
}