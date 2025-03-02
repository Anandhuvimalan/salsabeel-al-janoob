// /api/homepage/section2/uploadIcon/route.ts (Updated)
import { NextResponse } from 'next/server';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('icon') as File;
    const pathKey = formData.get('path') as string;
    const oldIconPath = formData.get('oldIconPath') as string;

    if (!file || !pathKey) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = [
      'image/svg+xml', 'image/png', 'image/jpeg', 
      'image/webp', 'image/avif'
    ];
    
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed formats: SVG, PNG, JPEG, WEBP, AVIF' },
        { status: 400 }
      );
    }

    // Delete old icon if exists
    if (oldIconPath) {
      const sanitizedOldPath = oldIconPath.replace(/^(\.\.(\/|\\|$))+/, '');
      const oldFullPath = path.join(
        process.cwd(),
        'public',
        'icons',
        path.basename(sanitizedOldPath)
      );

      try {
        await unlink(oldFullPath);
        console.log(`Deleted old icon: ${oldFullPath}`);
      } catch (error: any) {
        if (error.code !== 'ENOENT') {
          console.error('Error deleting old icon:', error);
        }
      }
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'svg';
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 15)}.${fileExtension}`;

    // Create target directory
    const uploadDir = path.join(process.cwd(), 'public', 'icons');
    await mkdir(uploadDir, { recursive: true });

    // Convert and save file
    const buffer = Buffer.from(await file.arrayBuffer());
    const fullPath = path.join(uploadDir, fileName);
    await writeFile(fullPath, buffer);

    return NextResponse.json({
      success: true,
      iconPath: `${fileName}`,
      path: pathKey
    });

  } catch (error) {
    console.error('Icon upload error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process icon upload',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}