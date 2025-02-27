// app/api/categories/route.ts
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ name: 1 });
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
    if (!name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\u0780-\u07BF]/g, '-') // Added Thaana unicode range
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    await connectDB();
    const category = await Category.create({ 
      name,
      slug 
    });
    
    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { message: "Error creating category" },
      { status: 500 }
    );
  }
}