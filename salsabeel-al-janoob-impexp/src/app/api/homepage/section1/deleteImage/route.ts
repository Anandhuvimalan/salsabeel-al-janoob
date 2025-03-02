import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import fs from "fs/promises";

// Path to the data file
const dataFilePath = path.join(process.cwd(), "data", "heroSectionData.json");

export async function POST(request: Request) {
  try {
    const { imagePath } = await request.json();

    if (!imagePath) {
      return NextResponse.json(
        { error: "No image path provided" },
        { status: 400 }
      );
    }

    // Determine the directory based on the image path
    let directory = "HeroSection";
    if (imagePath.includes("/Services/")) {
      directory = "Services";
    }
    
    // Extract filename from the path 
    const filename = path.basename(imagePath);
    const fullPath = path.join(process.cwd(), "public", directory, filename);

    try {
      // Check if file exists before trying to delete
      await fs.access(fullPath);
      // Delete the file
      await unlink(fullPath);
      console.log(`Successfully deleted file: ${fullPath}`);
    } catch (error: any) {
      // Only log the error if it's not just that the file doesn't exist
      if (error.code !== 'ENOENT') {
        console.error(`Error deleting file: ${fullPath}`, error);
        throw error;
      } else {
        console.log(`File already doesn't exist: ${fullPath}`);
      }
    }

    return NextResponse.json({ 
      message: "Image deleted successfully",
      path: imagePath
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}