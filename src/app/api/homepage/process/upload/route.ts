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
      console.error("No file uploaded in the request.");
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log("Received file:", file.name, "of size", file.size);

    // Delete old icon if provided
    if (oldImagePath) {
      try {
        const oldFilename = path.basename(oldImagePath);
        const oldFullPath = path.join(process.cwd(), "public", "uploads", "process", oldFilename);
        console.log("Attempting to delete old icon at:", oldFullPath);
        await unlink(oldFullPath);
        console.log("Old icon deleted successfully.");
      } catch (error: any) {
        if (error.code !== "ENOENT") {
          console.error("Error deleting old icon:", error);
          throw error;
        }
        console.log("Old icon not found, continuing with upload.");
      }
    }

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads", "process");
    console.log("Ensuring upload directory exists:", uploadDir);
    await mkdir(uploadDir, { recursive: true });

    // Generate unique filename and write file to disk
    const filename = `${uuidv4()}-${file.name}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadDir, filename);
    console.log("Writing file to:", filePath);
    await writeFile(filePath, buffer);
    console.log("File written successfully.");

    return NextResponse.json({ imagePath: `/uploads/process/${filename}` });
  } catch (error) {
    console.error("Icon upload failed:", error);
    return NextResponse.json({ error: "Failed to upload icon" }, { status: 500 });
  }
}
