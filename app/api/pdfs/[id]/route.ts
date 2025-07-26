import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import connectDB from "@/lib/db";
import PDF from "@/models/PDF";
import Category from "@/models/Category";

// DigitalOcean Spaces configuration
const ENDPOINT = process.env.DO_SPACES_ENDPOINT || "blr1.digitaloceanspaces.com";
const REGION = ENDPOINT.split(".")[0];
const BUCKET = process.env.DO_SPACES_BUCKET;

const s3Client = new S3Client({
  region: REGION,
  endpoint: `https://${ENDPOINT}`,
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY!,
    secretAccessKey: process.env.DO_SPACES_SECRET!,
  },
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connectDB();
    const pdf = await PDF.findById(id).populate('category', 'name slug').lean();
    if (!pdf) {
      console.log("PDF not found:", id);
      return NextResponse.json({ message: "PDF not found" }, { status: 404 });
    }
    console.log("PDF fetched:", id);
    return NextResponse.json({ pdf });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in GET /api/pdfs/[id]:", { message: errorMessage, error });
    return NextResponse.json(
      { message: "Error fetching PDF", error: errorMessage },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user || user.publicMetadata.role !== "admin") {
      console.log("Unauthorized attempt:", { userId });
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!BUCKET || !process.env.DO_SPACES_KEY || !process.env.DO_SPACES_SECRET) {
      console.error("Missing Spaces configuration");
      throw new Error("Spaces credentials or bucket not configured");
    }

    await connectDB();

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string | null;
    const categoryId = formData.get("categoryId") as string;
    const pdfFile = formData.get("pdfFile") as File | null;
    const imageFile = formData.get("image") as File | null;

    if (!title || !categoryId) {
      console.log("Missing required fields:", { title, categoryId });
      return NextResponse.json({ message: "Title and category are required" }, { status: 400 });
    }

    // Verify category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return NextResponse.json(
        { message: "Invalid category" },
        { status: 400 }
      );
    }

    const existingPDF = await PDF.findById(id);
    if (!existingPDF) {
      console.log("PDF not found:", id);
      return NextResponse.json({ message: "PDF not found" }, { status: 404 });
    }

    let pdfPath = existingPDF.pdfFile;
    if (pdfFile) {
      const pdfFileName = `${Date.now()}-${pdfFile.name}`;
      const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
      await s3Client.send(
        new PutObjectCommand({
          Bucket: BUCKET,
          Key: pdfFileName,
          Body: pdfBuffer,
          ACL: "public-read",
          ContentType: pdfFile.type,
        })
      );
      pdfPath = `https://${BUCKET}.${ENDPOINT}/${pdfFileName}`;

      if (existingPDF.pdfFile) {
        const oldPdfKey = existingPDF.pdfFile.split("/").pop();
        if (oldPdfKey) {
          console.log("Deleting old PDF:", oldPdfKey);
          await s3Client.send(
            new DeleteObjectCommand({ Bucket: BUCKET, Key: oldPdfKey })
          );
        }
      }
    }

    let imagePath = existingPDF.image;
    if (imageFile) {
      const imageFileName = `${Date.now()}-${imageFile.name}`;
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      await s3Client.send(
        new PutObjectCommand({
          Bucket: BUCKET,
          Key: imageFileName,
          Body: imageBuffer,
          ACL: "public-read",
          ContentType: imageFile.type,
        })
      );
      imagePath = `https://${BUCKET}.${ENDPOINT}/${imageFileName}`;

      if (existingPDF.image) {
        const oldImageKey = existingPDF.image.split("/").pop();
        if (oldImageKey) {
          console.log("Deleting old image:", oldImageKey);
          await s3Client.send(
            new DeleteObjectCommand({ Bucket: BUCKET, Key: oldImageKey })
          );
        }
      }
    }

    const updatedPDF = await PDF.findByIdAndUpdate(
      id,
      { 
        title, 
        description, 
        pdfFile: pdfPath, 
        image: imagePath, 
        category: categoryId,
        updatedAt: new Date() 
      },
      { new: true }
    ).populate('category', 'name slug').lean();

    console.log("PDF updated:", id);
    return NextResponse.json({ pdf: updatedPDF });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in PUT /api/pdfs/[id]:", { message: errorMessage, error });
    return NextResponse.json(
      { message: "Error updating PDF", error: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user || user.publicMetadata.role !== "admin") {
      console.log("Unauthorized attempt:", { userId });
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const pdf = await PDF.findById(id);
    if (!pdf) {
      console.log("PDF not found:", id);
      return NextResponse.json({ message: "PDF not found" }, { status: 404 });
    }

    if (pdf.pdfFile) {
      const pdfKey = pdf.pdfFile.split("/").pop();
      if (pdfKey) {
        console.log("Deleting PDF:", pdfKey);
        await s3Client.send(
          new DeleteObjectCommand({ Bucket: BUCKET, Key: pdfKey })
        );
      }
    }

    if (pdf.image) {
      const imageKey = pdf.image.split("/").pop();
      if (imageKey) {
        console.log("Deleting image:", imageKey);
        await s3Client.send(
          new DeleteObjectCommand({ Bucket: BUCKET, Key: imageKey })
        );
      }
    }

    await PDF.findByIdAndDelete(id);
    console.log("PDF deleted:", id);
    return NextResponse.json({ message: "PDF deleted successfully" });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in DELETE /api/pdfs/[id]:", { message: errorMessage, error });
    return NextResponse.json(
      { message: "Error deleting PDF", error: errorMessage },
      { status: 500 }
    );
  }
}