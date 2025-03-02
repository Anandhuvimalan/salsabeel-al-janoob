import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data/leadershipData.json");

export async function GET() {
  try {
    await fs.access(dataFilePath);
    const fileContents = await fs.readFile(dataFilePath, "utf8");
    return NextResponse.json(JSON.parse(fileContents));
  } catch (error: any) {
    if (error.code === "ENOENT") {
      const defaultData = {
        banner: "Meet Our Leaders",
        heading: "Our Leadership",
        profiles: []
      };
      await fs.writeFile(dataFilePath, JSON.stringify(defaultData, null, 2));
      return NextResponse.json(defaultData);
    }
    return NextResponse.json(
      { error: "Failed to load leadership data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
    return NextResponse.json({ message: "Leadership data updated successfully" });
  } catch (error) {
    console.error("Error saving leadership data:", error);
    return NextResponse.json(
      { error: "Failed to save leadership data" },
      { status: 500 }
    );
  }
}
