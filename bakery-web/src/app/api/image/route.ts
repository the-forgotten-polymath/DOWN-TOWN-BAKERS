import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const imagePath = searchParams.get('path');

  if (!imagePath) {
    return new NextResponse('Missing path parameter', { status: 400 });
  }

  // Resolve absolute path relative to the root Bakery directory (parent of bakery-web)
  const absolutePath = path.join(process.cwd(), '../', imagePath);

  try {
    // Prevent directory traversal attacks outside root workspace
    const rootDir = path.resolve(path.join(process.cwd(), '../'));
    const resolvedPath = path.resolve(absolutePath);
    if (!resolvedPath.startsWith(rootDir)) {
      return new NextResponse('Forbidden path traversal', { status: 403 });
    }

    let finalResolvedPath = resolvedPath;
    if (!fs.existsSync(finalResolvedPath)) {
      // Try fallback to 'cakes copy' if the request was for 'cakes/...'
      if (imagePath.startsWith('cakes/') || imagePath.startsWith('CAKES/')) {
        const fallbackPath = path.join(process.cwd(), '../', 'cakes copy', imagePath.substring(6));
        const resolvedFallback = path.resolve(fallbackPath);
        if (resolvedFallback.startsWith(rootDir) && fs.existsSync(resolvedFallback)) {
          finalResolvedPath = resolvedFallback;
        }
      }
    }

    if (!fs.existsSync(finalResolvedPath)) {
      // Try fallback for flat files directly inside 'cakes/' if nested folder structure is missing
      const baseName = path.basename(imagePath);
      const directPath = path.join(process.cwd(), '../', 'cakes', baseName);
      const resolvedDirect = path.resolve(directPath);
      if (resolvedDirect.startsWith(rootDir) && fs.existsSync(resolvedDirect)) {
        finalResolvedPath = resolvedDirect;
      }
    }

    if (!fs.existsSync(finalResolvedPath)) {
      return new NextResponse('Image file not found', { status: 404 });
    }

    const fileBuffer = fs.readFileSync(finalResolvedPath);
    
    // Determine appropriate Content-Type
    let contentType = 'image/jpeg';
    if (finalResolvedPath.endsWith('.png')) contentType = 'image/png';
    else if (finalResolvedPath.endsWith('.gif')) contentType = 'image/gif';
    else if (finalResolvedPath.endsWith('.svg')) contentType = 'image/svg+xml';
    else if (finalResolvedPath.endsWith('.webp')) contentType = 'image/webp';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving local image:', error);
    return new NextResponse('Internal Server Error loading local asset', { status: 500 });
  }
}
