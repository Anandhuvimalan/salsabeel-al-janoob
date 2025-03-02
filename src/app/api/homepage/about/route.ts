import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data/aboutSectionData.json");

export async function GET() {
  try {
    await fs.access(dataFilePath);
    const fileContents = await fs.readFile(dataFilePath, "utf8");
    return NextResponse.json(JSON.parse(fileContents));
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      const defaultData = {
        hero: {
          title: { highlight: "", subtitle: "" },
          description: [""],
          button: { text: "" },
          image: { src: "", alt: "" },
          imageOverlay: { text: "", icon: "" }
        },
        achievements: [],
        values: {
          title: "",
          items: [],
          image: { src: "", alt: "" }
        }
      };
      await fs.writeFile(dataFilePath, JSON.stringify(defaultData, null, 2));
      return NextResponse.json(defaultData);
    }
    return NextResponse.json(
      { error: "Failed to load about section data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
    return NextResponse.json({ message: "About section updated successfully" });
  } catch (error) {
    console.error("Error saving about section data:", error);
    return NextResponse.json(
      { error: "Failed to save about section data" },
      { status: 500 }
    );
  }
}