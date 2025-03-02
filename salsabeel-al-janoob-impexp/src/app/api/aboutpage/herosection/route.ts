import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data/aboutpagehero.json");

export async function GET() {
  try {
    const data = await fs.readFile(dataFilePath, "utf8");
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load hero section data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
    return NextResponse.json({ message: "Hero section updated successfully" });
  } catch (error) {
    console.error("Error saving data:", error);
    return NextResponse.json(
      { error: "Failed to save hero section data" },
      { status: 500 }
    );
  }
}