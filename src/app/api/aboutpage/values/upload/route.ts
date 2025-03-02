import { NextResponse } from "next/server";
import { writeFile, unlink, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("image") as File;
  const oldImagePath = formData.get("oldImagePath") as string;
  const { searchParams } = new URL(request.url);
  const field = searchParams.get("field"); // for potential future use

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  try {
    // Delete old image if provided
    if (oldImagePath) {
      try {
        const oldFilename = path.basename(oldImagePath);
        const oldFullPath = path.join(process.cwd(), "public", "uploads", "values", oldFilename);
        await unlink(oldFullPath);
      } catch (error) {
        console.log("Old image not found, continuing upload");
      }
    }

    // Ensure the upload directory exists
    const uploadDir = path.join(process.cwd(), "public/uploads/values");
    await mkdir(uploadDir, { recursive: true });

    // Generate a unique filename and save the file
    const filename = `${uuidv4()}-${file.name}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    return NextResponse.json({ imagePath: `/uploads/values/${filename}`, field });
  } catch (error) {
    console.error("Image upload failed:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
