import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const dataFilePath = path.join(process.cwd(), "data", "allwasteData.json")

export async function GET() {
  try {
    await fs.access(dataFilePath)
    const fileContents = await fs.readFile(dataFilePath, "utf8")
    return NextResponse.json(JSON.parse(fileContents))
  } catch (error: any) {
    if (error.code === "ENOENT") {
      // Create default data if file doesn't exist
      const defaultData = {
        pageInfo: {
          hero: {
            backgroundImage: "/waste-management.jpg",
            serviceType: "Waste Management",
            title: "Sustainable & Efficient",
            underlineText: "Waste Management Solutions",
            description:
              "Comprehensive waste management services focused on sustainability, compliance, and environmental protection.",
            buttonText: "Get in Touch",
            buttonLink: "/contact",
          },
          explanation: {
            header: "Waste Management Services",
            paragraphs: [
              "Our waste management services provide comprehensive solutions for businesses and communities. We focus on sustainable practices that minimize environmental impact while ensuring regulatory compliance.",
              "With our advanced technology and expert team, we handle all aspects of waste management from collection to disposal, recycling, and resource recovery.",
            ],
            imageSrc: "",
            imageAlt: "Waste Management Process",
            shutters: 5,
          },
          projects: {
            title: "Our Waste Management Projects",
            titleColor: "text-green-800",
            items: [
              {
                category: "Industrial Waste",
                title: "Factory Waste Reduction Program",
                src: "",
                details: {
                  description:
                    "Implemented a comprehensive waste reduction program for a manufacturing facility:\n\n• 40% reduction in landfill waste\n• 65% increase in recycling rates\n• Cost savings of $250,000 annually",
                  images: [
                    { src: "", alt: "Waste sorting facility" },
                    { src: "", alt: "Recycling process" },
                    { src: "", alt: "Results chart" },
                  ],
                },
              },
              {
                category: "Municipal Partnership",
                title: "City-Wide Recycling Initiative",
                src: "",
                details: {
                  description:
                    "Partnered with local government to revolutionize municipal waste management:\n\n• Served 250,000 residents\n• Diverted 15,000 tons from landfills\n• Implemented education programs reaching 50 schools",
                  images: [
                    { src: "", alt: "Community recycling center" },
                    { src: "", alt: "Educational workshop" },
                    { src: "", alt: "Waste reduction results" },
                  ],
                },
              },
            ],
          },
          faqs: {
            title: "Waste Management FAQs",
            highlightWord: "Solutions",
            description: "Find answers to common questions about our waste management services.",
            items: [
              {
                question: "What types of waste do you manage?",
                answer:
                  "We handle a wide range of waste types including general waste, recyclables, hazardous waste, electronic waste, and industrial waste. Our specialized teams are trained to handle each type according to regulatory requirements.",
              },
              {
                question: "How do you ensure environmental compliance?",
                answer:
                  "We maintain strict adherence to local and international environmental regulations. Our processes are regularly audited, and we maintain detailed documentation of all waste handling procedures to ensure full compliance.",
              },
              {
                question: "What sustainable practices do you implement?",
                answer:
                  "Our approach focuses on waste reduction, recycling, and resource recovery. We implement advanced sorting technologies, composting programs, and energy recovery systems to minimize landfill usage and environmental impact.",
              },
              {
                question: "How can businesses benefit from your services?",
                answer:
                  "Businesses can achieve cost savings through efficient waste management, demonstrate environmental responsibility to customers, ensure regulatory compliance, and potentially generate revenue from recyclable materials.",
              },
            ],
          },
          cta: {
            title: "Ready for Better Waste Management?",
            description:
              "Contact us today to discuss how our waste management solutions can benefit your business or community.",
            buttonText: "Contact Us",
            buttonLink: "/contact",
            buttonColor: "bg-green-600",
            hoverButtonColor: "hover:bg-green-700",
          },
        },
      }

      // Create the data directory if it doesn't exist
      const dataDir = path.join(process.cwd(), "data")
      try {
        await fs.access(dataDir)
      } catch (dirError) {
        await fs.mkdir(dataDir, { recursive: true })
      }

      await fs.writeFile(dataFilePath, JSON.stringify(defaultData, null, 2))
      return NextResponse.json(defaultData)
    }
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Create the data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), "data")
    try {
      await fs.access(dataDir)
    } catch (dirError) {
      await fs.mkdir(dataDir, { recursive: true })
    }

    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2))
    return NextResponse.json({ message: "updated successfully" })
  } catch (error) {
    console.error("Error saving waste management data:", error)
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 })
  }
}

