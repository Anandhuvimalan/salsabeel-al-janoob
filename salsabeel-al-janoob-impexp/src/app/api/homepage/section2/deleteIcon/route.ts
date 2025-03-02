// /api/homepage/section2/deleteIcon/route.ts (Updated)
import { NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { iconPath } = await request.json();

    if (!iconPath) {
      return NextResponse.json(
        { error: 'No icon path provided' },
        { status: 400 }
      );
    }

    // Sanitize and validate path
    const sanitizedPath = iconPath.replace(/^(\.\.(\/|\\|$))+/, '');
    const fullPath = path.join(
      process.cwd(),
      'public',
      'icons',
      path.basename(sanitizedPath)
    );

    try {
      await unlink(fullPath);
      console.log(`Successfully deleted: ${fullPath}`);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`File not found: ${fullPath}`);
      } else {
        throw error;
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Icon deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting icon:', error);
    return NextResponse.json(
      { error: 'Failed to delete icon' },
      { status: 500 }
    );
  }
}