import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import connectDB from "@/lib/db";
import PDF from "@/models/PDF";

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

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user || user.publicMetadata.role !== "admin") {
      console.log("Unauthorized access attempt:", { userId });
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
    const pdfFile = formData.get("pdfFile") as File | null;
    const imageFile = formData.get("image") as File | null;

    if (!title || !pdfFile) {
      console.log("Missing required fields:", { title, pdfFile });
      return NextResponse.json(
        { message: "Title and PDF file are required" },
        { status: 400 }
      );
    }

    // Upload PDF to Spaces
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
    const pdfUrl = `https://${BUCKET}.${ENDPOINT}/${pdfFileName}`;

    // Upload image to Spaces (if provided)
    let imageUrl: string | undefined;
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
      imageUrl = `https://${BUCKET}.${ENDPOINT}/${imageFileName}`;
    }

    // Save to MongoDB
    const pdfDoc = await PDF.create({
      title,
      description,
      pdfFile: pdfUrl,
      image: imageUrl,
      author: userId,
    });

    // Note: Clerk doesn't support direct population, so author stays as userId
    console.log("PDF created:", pdfDoc._id);
    return NextResponse.json({ pdf: pdfDoc }, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in POST /api/pdfs:", { message: errorMessage, error });
    return NextResponse.json(
      { message: "Error creating PDF", error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "6", 10);

    await connectDB();

    const skip = (page - 1) * limit;
    const [pdfs, total] = await Promise.all([
      PDF.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(), // Use lean() for performance since we don’t need Mongoose docs
      PDF.countDocuments({}),
    ]);

    console.log(`Fetched ${pdfs.length} PDFs, page ${page}, total: ${total}`);
    return NextResponse.json({ pdfs, total });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in GET /api/pdfs:", { message: errorMessage, error });
    return NextResponse.json(
      { message: "Error fetching PDFs", error: errorMessage },
      { status: 500 }
    );
  }
}