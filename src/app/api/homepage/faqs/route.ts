import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "faqs.json");

export async function GET() {
  try {
    const fileContents = await fs.readFile(dataFilePath, "utf8");
    return NextResponse.json(JSON.parse(fileContents));
  } catch (error) {
    console.error("Error reading faqs.json:", error);
    return NextResponse.json({ error: "Failed to load FAQ data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
    return NextResponse.json({ message: "FAQ data updated successfully" });
  } catch (error) {
    console.error("Error saving FAQ data:", error);
    return NextResponse.json({ error: "Failed to save FAQ data" }, { status: 500 });
  }
}
