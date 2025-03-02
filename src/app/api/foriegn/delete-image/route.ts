import { NextResponse } from "next/server"
import { unlink } from "fs/promises"
import path from "path"

export async function POST(request: Request) {
  try {
    const { imagePath } = await request.json()
    if (!imagePath) {
      return NextResponse.json({ error: "No image path provided" }, { status: 400 })
    }

    const filename = path.basename(imagePath)
    const fullPath = path.join(process.cwd(), "public", "uploads", "foriegn", filename)

    try {
      await unlink(fullPath)
      console.log("Image deleted successfully:", fullPath)
    } catch (error: any) {
      if (error.code !== "ENOENT") {
        console.error("Error deleting image:", error)
        throw error
      }
      console.log("Image not found, may have been already deleted:", fullPath)
    }

    return NextResponse.json({ message: "Image deleted successfully" })
  } catch (error) {
    console.error("Error deleting image:", error)
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 })
  }
}

