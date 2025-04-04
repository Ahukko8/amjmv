/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import connectDB from "@/lib/db";
import OtherChannelBlog from "@/models/otherChannelsBlogs";
import { isValidObjectId } from "mongoose";

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

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    if (!isValidObjectId(id)) {
      return NextResponse.json({ message: "Invalid blog ID format" }, { status: 400 });
    }

    await connectDB();
    const otherBlog = await OtherChannelBlog.findById(id)
      .populate('categories', 'name slug');

    if (!otherBlog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ otherBlog });
  } catch (error: any) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { message: "Error fetching blog", error: error.toString() },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    if (!isValidObjectId(id)) {
      return NextResponse.json({ message: "Invalid blog ID format" }, { status: 400 });
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

    if (!process.env.DO_SPACES_KEY || !process.env.DO_SPACES_SECRET || !process.env.DO_SPACES_BUCKET) {
      throw new Error('Spaces credentials or bucket not configured');
    }

    await connectDB();
    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;
    const updates = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      fontFamily: formData.get('fontFamily') as string,
      fontSize: formData.get('fontSize') as string,
      categories: formData.get('categories') ? JSON.parse(formData.get('categories') as string) : undefined,
    };

    const otherExistingBlog = await OtherChannelBlog.findById(id);
    if (!otherExistingBlog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    let imageUrl = otherExistingBlog.image;
    if (imageFile) {
      if (otherExistingBlog.image) {
        const oldImageKey = otherExistingBlog.image.split('/').pop();
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: process.env.DO_SPACES_BUCKET,
            Key: `blog-images/${oldImageKey}`,
          })
        );
      }

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

    const otherUpdatedBlog = await OtherChannelBlog.findByIdAndUpdate(
      id,
      {
        ...updates,
        image: imageUrl,
        // author: userId,
      },
      { new: true, runValidators: true }
    )
      .populate('categories', 'name slug');

    return NextResponse.json({ blog: otherUpdatedBlog });
  } catch (error: any) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { message: "Error updating blog", error: error.toString() },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    if (!isValidObjectId(id)) {
      return NextResponse.json({ message: "Invalid blog ID format" }, { status: 400 });
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

    const body = await request.json();
    const { status } = body;
    if (!status || !["draft", "published"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid or missing status value" },
        { status: 400 }
      );
    }

    await connectDB();

    const blog = await OtherChannelBlog.findById(id);
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
  } catch (error: any) {
    console.error("Error updating blog status:", error);
    return NextResponse.json(
      { message: "Error updating blog status", error: error.toString() },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    if (!isValidObjectId(id)) {
      return NextResponse.json({ message: "Invalid blog ID format" }, { status: 400 });
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

    const blog = await OtherChannelBlog.findById(id);
    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    if (blog.image) {
      const imageKey = blog.image.split('/').pop();
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.DO_SPACES_BUCKET,
          Key: `blog-images/${imageKey}`,
        })
      );
    }

    await OtherChannelBlog.findByIdAndDelete(id);

    return NextResponse.json({ message: "Blog deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { message: "Error deleting blog", error: error.toString() },
      { status: 500 }
    );
  }
}