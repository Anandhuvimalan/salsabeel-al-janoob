import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data/memorialData.json");

export async function GET() {
  try {
    const fileContents = await fs.readFile(dataFilePath, "utf8");
    return NextResponse.json(JSON.parse(fileContents));
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to load memorial data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
    return NextResponse.json({ message: "Memorial data updated successfully" });
  } catch (error) {
    console.error("Error saving memorial data:", error);
    return NextResponse.json(
      { error: "Failed to save memorial data" },
      { status: 500 }
    );
  }
}
