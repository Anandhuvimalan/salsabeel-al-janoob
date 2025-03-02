import { NextResponse } from "next/server";
import { writeFile, unlink, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("image") as File;
  const oldImagePath = formData.get("oldImagePath") as string;
  const { searchParams } = new URL(request.url);
  // "field" can be used to identify the testimonial (e.g. "testimonial_column1_0")
  const field = searchParams.get("field");

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  try {
    if (oldImagePath) {
      try {
        const oldFilename = path.basename(oldImagePath);
        const oldFullPath = path.join(
          process.cwd(),
          "public",
          "uploads",
          "testimonials",
          oldFilename
        );
        await unlink(oldFullPath);
      } catch (error) {
        console.log("Old image not found, continuing upload");
      }
    }
    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "testimonials"
    );
    await mkdir(uploadDir, { recursive: true });
    const filename = `${uuidv4()}-${file.name}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);
    return NextResponse.json({ imagePath: `/uploads/testimonials/${filename}`, field });
  } catch (error) {
    console.error("Image upload failed:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
