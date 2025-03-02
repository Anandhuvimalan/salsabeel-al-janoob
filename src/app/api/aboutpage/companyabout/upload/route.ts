import { NextResponse } from "next/server";
import { writeFile, unlink, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("image") as File;
  const oldImagePath = formData.get("oldImagePath") as string;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  try {
    // Delete old image if exists
    if (oldImagePath) {
      const oldFullPath = path.join(process.cwd(), "public", oldImagePath);
      try {
        await unlink(oldFullPath);
      } catch (error) {
        console.log("Old image not found, continuing upload");
      }
    }

    // Create upload directory
    const uploadDir = path.join(process.cwd(), "public/uploads/companyabout");
    await mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const filename = `${uuidv4()}-${file.name}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, buffer);
    
    return NextResponse.json({ 
      imagePath: `/uploads/companyabout/${filename}`
    });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}