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
      console.error("No file uploaded");
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (oldImagePath) {
      try {
        const oldFilename = path.basename(oldImagePath);
        const oldFullPath = path.join(process.cwd(), "public", "uploads", "footer", oldFilename);
        await unlink(oldFullPath);
      } catch (error: any) {
        if (error.code !== "ENOENT") throw error;
      }
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "footer");
    await mkdir(uploadDir, { recursive: true });

    const filename = `${uuidv4()}-${file.name}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    return NextResponse.json({ imagePath: `/uploads/footer/${filename}` });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
