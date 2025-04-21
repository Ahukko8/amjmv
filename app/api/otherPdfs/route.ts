/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import connectDB from "@/lib/db";
import PDF from "@/models/otherpdf";
import OtherCateogry from "@/models/othercategories"
import { FilterQuery } from "mongoose";

// DigitalOcean Spaces configuration
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



export async function GET(request: Request) {
  try {
    console.log('GET request received for /api/otherPdfs');
    const { userId } = await auth();
    console.log('User ID from auth:', userId);
    const user = await currentUser();
    console.log('User object:', user);

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '6', 10);

    console.log('Connecting to DB...');
    await connectDB();
    console.log('DB connected');

    const query: FilterQuery<any> = {};
    if (!userId || user?.publicMetadata.role !== 'admin') {
      console.log('User is not admin or not authenticated, filtering published blogs');
      query.status = 'published';
    }
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (category) {
      query.categories = category;
    }

    const skip = (page - 1) * limit;
    console.log('Fetching blogs with query:', query);
    const [pdfs, total] = await Promise.all([
      PDF.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('categories', 'name slug'),
      PDF.countDocuments(query),
    ]);

    console.log('Blogs fetched successfully:', pdfs.length);
    return NextResponse.json({ pdfs, total });
  } catch (error: any) {
    console.error('Error fetching blogs:', error.message, error.stack);
    return NextResponse.json(
      { message: 'Error fetching blogs', error: error.message },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user || user.publicMetadata.role !== "admin") {
      console.log("Unauthorized access attempt:", { userId });
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!BUCKET || !process.env.DO_SPACES_KEY_OTHER_PDF || !process.env.DO_SPACES_SECRET_OTHER_PDF) {
      console.error("Missing Spaces configuration");
      throw new Error("Spaces credentials or bucket not configured");
    }

    await connectDB();

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string | null;
    const pdfFile = formData.get("pdfFile") as File | null;
    const imageFile = formData.get("image") as File | null;
    const categoryIds = formData.getAll("categories") as string[]; // Get categories as array of IDs

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

    // Fetch categories from MongoDB using categoryIds
    const categories = await OtherCateogry.find({ _id: { $in: categoryIds } });
    if (categories.length !== categoryIds.length) {
      console.log("Some categories not found");
      return NextResponse.json({ message: "Some categories not found" }, { status: 400 });
    }

    // Save the PDF document to MongoDB
    const pdfDoc = await PDF.create({
      title,
      description,
      pdfFile: pdfUrl,
      image: imageUrl,
      author: userId,
      categories: categories.map((category) => category._id), // Save category IDs
    });

    console.log("PDF created:", pdfDoc._id);
    return NextResponse.json({ pdf: pdfDoc }, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in POST /api/otherPdfs:", { message: errorMessage, error });
    return NextResponse.json(
      { message: "Error creating PDF", error: errorMessage },
      { status: 500 }
    );
  }
}

// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const page = parseInt(searchParams.get("page") || "1", 10);
//     const limit = parseInt(searchParams.get("limit") || "6", 10);

//     await connectDB();

//     const skip = (page - 1) * limit;
//     const [pdfs, total] = await Promise.all([
//       PDF.find({})
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit)
//         .populate("categories") // Populate categories field
//         .lean(), // Use lean() for performance since we don’t need Mongoose docs
//       PDF.countDocuments({}),
//     ]);

//     console.log(`Fetched ${pdfs.length} PDFs, page ${page}, total: ${total}`);
//     return NextResponse.json({ pdfs, total });
//   } catch (error: unknown) {
//     const errorMessage = error instanceof Error ? error.message : "Unknown error";
//     console.error("Error in GET /api/otherPdfs:", { message: errorMessage, error });
//     return NextResponse.json(
//       { message: "Error fetching PDFs", error: errorMessage },
//       { status: 500 }
//     );
//   }
// }

// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(req.url);
//     const page = parseInt(searchParams.get("page") || "1");
//     const limit = parseInt(searchParams.get("limit") || "10");
//     const categoryId = searchParams.get("category");

//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const query: any = {};
//     if (categoryId) {
//       query.categories = categoryId;
//     }

//     const pdfs = await PDF.find(query)
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .lean();

//     const total = await PDF.countDocuments(query);

//     return NextResponse.json({ pdfs, total });
//   } catch (error) {
//     console.error("Error fetching PDFs:", error);
//     return NextResponse.json({ message: "Failed to fetch PDFs" }, { status: 500 });
//   }
// }



