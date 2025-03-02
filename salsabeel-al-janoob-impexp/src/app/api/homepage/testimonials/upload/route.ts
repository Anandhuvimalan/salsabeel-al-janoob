import { NextResponse } from "next/server";
import { writeFile, unlink, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;
    const oldImagePath = formData.get("oldImagePath") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (oldImagePath && oldImagePath.startsWith('/uploads/testimonials/')) {
      try {
        const oldImagePathWithoutSlash = oldImagePath.slice(1);
        const oldFullPath = path.join(process.cwd(), 'public', oldImagePathWithoutSlash);
        await unlink(oldFullPath);
      } catch (error: any) {
        if (error.code !== "ENOENT") throw error;
      }
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "testimonials");
    await mkdir(uploadDir, { recursive: true });

    const filename = `${uuidv4()}-${file.name}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    return NextResponse.json({ imagePath: `/uploads/testimonials/${filename}` });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}