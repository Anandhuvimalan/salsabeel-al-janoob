import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const { imagePath } = await request.json();
    
    if (!imagePath || !imagePath.startsWith('/uploads/testimonials/')) {
      return NextResponse.json(
        { error: "Invalid image path" }, 
        { status: 400 }
      );
    }

    const imagePathWithoutSlash = imagePath.slice(1);
    const fullPath = path.join(process.cwd(), 'public', imagePathWithoutSlash);

    try {
      await unlink(fullPath);
    } catch (error: any) {
      if (error.code !== "ENOENT") throw error;
    }

    return NextResponse.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" }, 
      { status: 500 }
    );
  }
}