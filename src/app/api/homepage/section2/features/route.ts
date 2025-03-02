// /api/homepage/section2/features/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data/features.json');

export async function GET() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load features data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validation
    const validationErrors = [];
    if (!data.heading?.title) validationErrors.push("Heading title is required");
    if (!data.heading?.subtitle) validationErrors.push("Heading subtitle is required");
    if (!data.cta?.title) validationErrors.push("CTA title is required");
    if (!data.cta?.subtitle) validationErrors.push("CTA subtitle is required");
    if (!data.cta?.linkText) validationErrors.push("CTA link text is required");
    if (!data.cta?.linkUrl) validationErrors.push("CTA link URL is required");

    data.features?.forEach((feature: any, index: number) => {
      if (!feature.title) validationErrors.push(`Feature ${index + 1}: Title required`);
      if (!feature.description) validationErrors.push(`Feature ${index + 1}: Description required`);
      if (!feature.icon) validationErrors.push(`Feature ${index + 1}: Icon required`);
      if (feature.details?.length === 0) validationErrors.push(`Feature ${index + 1}: At least one detail required`);
      feature.details?.forEach((detail: string, detailIndex: number) => {
        if (!detail.trim()) validationErrors.push(`Feature ${index + 1} detail ${detailIndex + 1}: Required`);
      });
    });

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: "Validation failed", details: validationErrors },
        { status: 400 }
      );
    }

    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
    return NextResponse.json({ message: 'Data saved successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save features data" },
      { status: 500 }
    );
  }
}