import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data/services.json");

export async function GET() {
  try {
    await fs.access(dataFilePath);
    const fileContents = await fs.readFile(dataFilePath, "utf8");
    return NextResponse.json(JSON.parse(fileContents));
  } catch (error: any) {
    if (error.code === "ENOENT") {
      const defaultData = {
        sectionTitle: "More Than Just Import & Export",
        services: []
      };
      await fs.writeFile(dataFilePath, JSON.stringify(defaultData, null, 2));
      return NextResponse.json(defaultData);
    }
    return NextResponse.json(
      { error: "Failed to load services data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
    return NextResponse.json({ message: "Services data updated successfully" });
  } catch (error) {
    console.error("Error saving services data:", error);
    return NextResponse.json(
      { error: "Failed to save services data" },
      { status: 500 }
    );
  }
}
