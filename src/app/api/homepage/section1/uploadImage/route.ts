import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import fs from "fs/promises";

// Path to the data file
const dataFilePath = path.join(process.cwd(), "data", "heroSectionData.json");

async function ensureDirectoryExists(dirPath: string) {
  try {
    await fs.access(dirPath);
  } catch (error) {
    await mkdir(dirPath, { recursive: true });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("images") as File[];
    const altTexts = formData.getAll("altTexts") as string[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const uploadedImages = [];
    
    // Ensure directories exist
    const publicDir = path.join(process.cwd(), "public");
    await ensureDirectoryExists(publicDir);
    
    const heroDir = path.join(publicDir, "HeroSection");
    await ensureDirectoryExists(heroDir);
    
    // Process each uploaded file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const altText = i < altTexts.length ? altTexts[i] : "";
      
      if (!validTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid file type for ${file.name}. Only JPG, JPEG, PNG, WEBP, and GIF are allowed.` },
          { status: 400 }
        );
      }

      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: `File size exceeds the 5MB limit for ${file.name}.` },
          { status: 400 }
        );
      }

      // Generate a unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 10);
      const fileExtension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `${timestamp}-${randomString}.${fileExtension}`;
      
      const filePath = path.join(heroDir, fileName);

      // Convert the file to a buffer and save it
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await writeFile(filePath, buffer);
      
      // Create the public path for the image
      const publicPath = `/HeroSection/${fileName}`;
      uploadedImages.push({
        src: publicPath,
        alt: altText || `Hero image ${i + 1}`
      });
    }

    return NextResponse.json({ 
      images: uploadedImages,
      message: "Images uploaded successfully"
    });
  } catch (error) {
    console.error("Error uploading images:", error);
    return NextResponse.json(
      { error: "Failed to upload images. Please try again." },
      { status: 500 }
    );
  }
}