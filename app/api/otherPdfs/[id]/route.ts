/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import connectDB from "@/lib/db";
import OtherPDF from "@/models/otherpdf";
import OtherCategory from "@/models/othercategories";

// DigitalOcean Spaces config
const ENDPOINT = process.env.DO_SPACES_ENDPOINT || "blr1.digitaloceanspaces.com";
const REGION = ENDPOINT.split(".")[0];
const BUCKET = process.env.DO_SPACES_BUCKET_OTHER_PDF;

const s3Client = new S3Client({
  region: REGION,
  endpoint: `https://${ENDPOINT}`,
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY_OTHER_PDF!,
    secretAccessKey: process.env.DO_SPACES_SECRET_OTHER_PDF!,
  },
});

// GET a single PDF by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    await connectDB();
    const pdf = await OtherPDF.findById(id).populate("categories").lean();

    if (!pdf) {
      return NextResponse.json({ message: "PDF not found" }, { status: 404 });
    }

    return NextResponse.json({ pdf });
  } catch (error: any) {
    console.error("Error fetching PDF:", error);
    return NextResponse.json({ message: "Error fetching PDF", error: error.message }, { status: 500 });
  }
}

// PUT: Update a PDF
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user || user.publicMetadata.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string | null;
    const categoryId = formData.get("category") as string | null;
    const pdfFile = formData.get("pdfFile") as File | null;
    const imageFile = formData.get("image") as File | null;

    if (!title) {
      return NextResponse.json({ message: "Title is required" }, { status: 400 });
    }

    const existingPDF = await OtherPDF.findById(id);
    if (!existingPDF) {
      return NextResponse.json({ message: "PDF not found" }, { status: 404 });
    }

    let pdfPath = existingPDF.pdfFile;
    if (pdfFile) {
      const pdfFileName = `${Date.now()}-${pdfFile.name}`;
      const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
      await s3Client.send(new PutObjectCommand({
        Bucket: BUCKET,
        Key: pdfFileName,
        Body: pdfBuffer,
        ACL: "public-read",
        ContentType: pdfFile.type,
      }));
      pdfPath = `https://${BUCKET}.${ENDPOINT}/${pdfFileName}`;

      const oldPdfKey = existingPDF.pdfFile?.split("/").pop();
      if (oldPdfKey) {
        await s3Client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: oldPdfKey }));
      }
    }

    let imagePath = existingPDF.image;
    if (imageFile) {
      const imageFileName = `${Date.now()}-${imageFile.name}`;
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      await s3Client.send(new PutObjectCommand({
        Bucket: BUCKET,
        Key: imageFileName,
        Body: imageBuffer,
        ACL: "public-read",
        ContentType: imageFile.type,
      }));
      imagePath = `https://${BUCKET}.${ENDPOINT}/${imageFileName}`;

      const oldImageKey = existingPDF.image?.split("/").pop();
      if (oldImageKey) {
        await s3Client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: oldImageKey }));
      }
    }

    // Validate category
    let category = null;
    if (categoryId) {
      category = await OtherCategory.findById(categoryId);
      if (!category) {
        return NextResponse.json({ message: "Invalid category" }, { status: 400 });
      }
    }

    const updatedPDF = await OtherPDF.findByIdAndUpdate(
      id,
      {
        title,
        description,
        categories: categoryId ? [categoryId] : existingPDF.categories,
        pdfFile: pdfPath,
        image: imagePath,
        updatedAt: new Date(),
      },
      { new: true }
    ).populate("categories").lean();

    return NextResponse.json({ pdf: updatedPDF });
  } catch (error: any) {
    console.error("Error updating PDF:", error);
    return NextResponse.json({ message: "Error updating PDF", error: error.message }, { status: 500 });
  }
}

// DELETE a PDF by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user || user.publicMetadata.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const pdf = await OtherPDF.findById(id);
    if (!pdf) {
      return NextResponse.json({ message: "PDF not found" }, { status: 404 });
    }

    const pdfKey = pdf.pdfFile?.split("/").pop();
    if (pdfKey) {
      await s3Client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: pdfKey }));
    }

    const imageKey = pdf.image?.split("/").pop();
    if (imageKey) {
      await s3Client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: imageKey }));
    }

    await OtherPDF.findByIdAndDelete(id);

    return NextResponse.json({ message: "PDF deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting PDF:", error);
    return NextResponse.json({ message: "Error deleting PDF", error: error.message }, { status: 500 });
  }
}
