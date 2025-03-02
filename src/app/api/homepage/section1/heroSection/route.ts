import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Define the data structure
interface HeroSectionData {
  tag: string;
  title: string;
  highlightedTitle: string;
  description: string;
  buttonName: string;
  buttonLink: string;
  animationSettings: {
    cycleDuration: number;
    animationDuration: number;
    initialRevealDelay: number;
  };
  images: {
    src: string;
    alt: string;
  }[];
}

// Path to the data file
const dataFilePath = path.join(process.cwd(), "data", "heroSectionData.json");

// Ensure the data directory exists
async function ensureDataDirectoryExists() {
  const dataDir = path.join(process.cwd(), "data");
  try {
    await fs.access(dataDir);
  } catch (error) {
    // Directory doesn't exist, create it
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Validate the hero section data
function validateHeroData(data: any): { valid: boolean; errors?: string[] } {
  const errors: string[] = [];

  if (!data) errors.push("Data is missing");
  else {
    if (!data.title?.trim()) errors.push("Title is required");
    if (!data.description?.trim()) errors.push("Description is required");
    if (!data.buttonName?.trim()) errors.push("Button text is required");
    if (!data.buttonLink?.trim()) errors.push("Button link is required");
    
    // Validate animation settings
    if (!data.animationSettings) {
      errors.push("Animation settings are required");
    } else {
      if (data.animationSettings.cycleDuration <= 0) {
        errors.push("Cycle duration must be greater than 0");
      }
      if (data.animationSettings.animationDuration <= 0) {
        errors.push("Animation duration must be greater than 0");
      }
      if (data.animationSettings.initialRevealDelay < 0) {
        errors.push("Initial reveal delay cannot be negative");
      }
    }
    
    // Validate images
    if (!data.images || !Array.isArray(data.images) || data.images.length === 0) {
      errors.push("At least one image is required");
    } else {
      for (let i = 0; i < data.images.length; i++) {
        const image = data.images[i];
        if (!image.src) {
          errors.push(`Image at index ${i} is missing a source path`);
        }
        if (!image.alt) {
          errors.push(`Image at index ${i} is missing alt text`);
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
}

// GET: Reads the hero section data from the JSON file
export async function GET() {
  try {
    await ensureDataDirectoryExists();

    try {
      const fileContents = await fs.readFile(dataFilePath, "utf8");
      const data = JSON.parse(fileContents);
      return NextResponse.json(data);
    } catch (readError: any) {
      // If file doesn't exist, return default values
      if (readError.code === 'ENOENT') {
        const defaultData: HeroSectionData = {
          tag: "GLOBAL SOLUTIONS",
          title: "Your Gateway to the",
          highlightedTitle: "International Market",
          description: "Our specialized import and export solutions connect your business with global opportunities. Experience seamless trade and unparalleled service.",
          buttonName: "Get in Touch",
          buttonLink: "/contact",
          animationSettings: {
            cycleDuration: 3000,
            animationDuration: 1500,
            initialRevealDelay: 2000
          },
          images: [
            {
              src: "",
              alt: "Default hero image"
            }
          ]
        };

        // Create the file with default data
        await fs.writeFile(dataFilePath, JSON.stringify(defaultData, null, 2), "utf8");
        return NextResponse.json(defaultData);
      }
      
      // For other errors, re-throw
      throw readError;
    }
  } catch (error) {
    console.error("Error reading hero section data:", error);
    return NextResponse.json(
      { error: "Failed to load hero section data" },
      { status: 500 }
    );
  }
}

// POST: Updates the hero section data in the JSON file
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate the data before saving
    const validation = validateHeroData(data);
    if (!validation.valid) {
      return NextResponse.json(
        { 
          error: "Invalid data provided", 
          details: validation.errors 
        },
        { status: 400 }
      );
    }

    await ensureDataDirectoryExists();
    
    // Ensure we only save the fields we want
    const sanitizedData: HeroSectionData = {
      tag: data.tag || "",
      title: data.title,
      highlightedTitle: data.highlightedTitle || "",
      description: data.description,
      buttonName: data.buttonName,
      buttonLink: data.buttonLink,
      animationSettings: {
        cycleDuration: Number(data.animationSettings.cycleDuration),
        animationDuration: Number(data.animationSettings.animationDuration),
        initialRevealDelay: Number(data.animationSettings.initialRevealDelay)
      },
      images: data.images.map((img: any) => ({
        src: img.src,
        alt: img.alt || ""
      }))
    };

    await fs.writeFile(
      dataFilePath, 
      JSON.stringify(sanitizedData, null, 2), 
      "utf8"
    );
    
    return NextResponse.json({ 
      message: "Hero section data updated successfully",
      data: sanitizedData
    });
  } catch (error) {
    console.error("Error updating hero section data:", error);
    return NextResponse.json(
      { error: "Failed to update hero section data" },
      { status: 500 }
    );
  }
}