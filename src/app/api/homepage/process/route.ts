import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "process.json");

export async function GET() {
  try {
    await fs.access(dataFilePath);
    const fileContents = await fs.readFile(dataFilePath, "utf8");
    return NextResponse.json(JSON.parse(fileContents));
  } catch (error: any) {
    if (error.code === "ENOENT") {
      const defaultData = {
        section: {
          heading: "Our Seamless Import & Export Process",
          description:
            "Follow our step-by-step approach to experience hassle-free import and export services.",
          buttonLink: "/about",
          buttonText: "More About Us"
        },
        steps: [
          {
            title: "Consultation & Planning",
            description: "Discuss your needs and craft a tailored trade strategy.",
            iconSrc: "",
            hoverFrom: "hover:from-purple-500",
            hoverTo: "hover:to-indigo-600",
            iconFrom: "from-purple-500",
            iconTo: "to-indigo-600"
          },
          {
            title: "Documentation & Compliance",
            description: "We handle paperwork and ensure full regulatory compliance.",
            iconSrc: "",
            hoverFrom: "hover:from-blue-500",
            hoverTo: "hover:to-green-500",
            iconFrom: "from-blue-500",
            iconTo: "to-green-500"
          },
          {
            title: "Logistics & Transportation",
            description: "Efficient shipping solutions to move your goods globally.",
            iconSrc: "",
            hoverFrom: "hover:from-red-500",
            hoverTo: "hover:to-pink-500",
            iconFrom: "from-red-500",
            iconTo: "to-pink-500"
          },
          {
            title: "Customs Clearance",
            description: "Expert management of customs procedures for smooth border crossings.",
            iconSrc: "",
            hoverFrom: "hover:from-yellow-500",
            hoverTo: "hover:to-orange-500",
            iconFrom: "from-yellow-500",
            iconTo: "to-orange-500"
          },
          {
            title: "Delivery & After Service",
            description: "Reliable delivery and dedicated support after shipment.",
            iconSrc: "",
            hoverFrom: "hover:from-green-500",
            hoverTo: "hover:to-teal-500",
            iconFrom: "from-green-500",
            iconTo: "to-teal-500"
          },
          {
            title: "After Sales Support",
            description: "Continuous support and feedback to help your business thrive.",
            iconSrc: "",
            hoverFrom: "hover:from-indigo-500",
            hoverTo: "hover:to-purple-500",
            iconFrom: "from-indigo-500",
            iconTo: "to-purple-500"
          }
        ]
      };
      await fs.writeFile(dataFilePath, JSON.stringify(defaultData, null, 2));
      return NextResponse.json(defaultData);
    }
    return NextResponse.json({ error: "Failed to load process data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
    return NextResponse.json({ message: "Process data updated successfully" });
  } catch (error) {
    console.error("Error saving process data:", error);
    return NextResponse.json({ error: "Failed to save process data" }, { status: 500 });
  }
}
