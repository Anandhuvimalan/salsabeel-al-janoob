import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const { imagePath } = await request.json();

    if (!imagePath) {
      return NextResponse.json(
        { error: "No image path provided" },
        { status: 400 }
      );
    }

    const fullPath = path.join(process.cwd(), "public", imagePath);
    
    try {
      await unlink(fullPath);
    } catch (error: any) {
      if (error.code !== 'ENOENT') throw error;
    }

    return NextResponse.json({ 
      message: "Image deleted successfully" 
    });
  } catch (error) {
    console.error("Delete failed:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}