import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const imagePath = searchParams.get('path');

  if (!imagePath) {
    return new NextResponse('Missing path parameter', { status: 400 });
  }

  // Handle external proxy requests to perfectly bypass hotlinking protections / missing sibling directories on Vercel
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    try {
      const res = await fetch(imagePath, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        },
        cache: 'force-cache',
      });
      
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        return new NextResponse(buffer, {
          headers: {
            'Content-Type': res.headers.get('content-type') || 'image/jpeg',
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }
    } catch (err) {
      console.error('Error proxying remote image:', err);
    }
    
    // Fallback if proxy fetch fails
    try {
      const fallbackBuf = fs.readFileSync(path.join(process.cwd(), 'public/hero_cake_1778560729107.png'));
      return new NextResponse(fallbackBuf, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=86400',
        },
      });
    } catch (e) {
      return new NextResponse('Image not found', { status: 404 });
    }
  }

  // Handle static edge-cached categories directly if passed by mistake
  if (imagePath.startsWith('/categories/')) {
    try {
      const filePath = path.join(process.cwd(), 'public', imagePath);
      const fileBuffer = fs.readFileSync(filePath);
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=86400, immutable',
        },
      });
    } catch (e) {
      // Fallback below
    }
  }

  // Resolve absolute path relative to the root Bakery directory (parent of bakery-web)
  const baseDir = path.normalize(path.join(process.cwd(), '../'));
  const absolutePath = path.normalize(baseDir + '/' + imagePath);

  try {
    // Prevent directory traversal attacks outside root workspace
    if (!absolutePath.startsWith(baseDir)) {
      return new NextResponse('Forbidden path traversal', { status: 403 });
    }

    let finalResolvedPath = absolutePath;
    if (!fs.existsSync(finalResolvedPath)) {
      // Try fallback to 'cakes copy' if the request was for 'cakes/...'
      if (imagePath.startsWith('cakes/') || imagePath.startsWith('CAKES/')) {
        const subPath = imagePath.substring(6);
        const fallbackPath = path.normalize(baseDir + '/cakes copy/' + subPath);
        if (fallbackPath.startsWith(baseDir) && fs.existsSync(fallbackPath)) {
          finalResolvedPath = fallbackPath;
        }
      }
    }

    if (!fs.existsSync(finalResolvedPath)) {
      // Try fallback for flat files directly inside 'cakes/' if nested folder structure is missing
      const baseName = path.basename(imagePath);
      const directPath = path.normalize(baseDir + '/cakes/' + baseName);
      if (directPath.startsWith(baseDir) && fs.existsSync(directPath)) {
        finalResolvedPath = directPath;
      }
    }

    if (!fs.existsSync(finalResolvedPath)) {
      // Graceful fallback to default guaranteed hero image for zero-broken layout on production
      try {
        const fallbackBuf = fs.readFileSync(path.join(process.cwd(), 'public/hero_cake_1778560729107.png'));
        return new NextResponse(fallbackBuf, {
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=86400',
          },
        });
      } catch (e) {
        return new NextResponse('Image file not found', { status: 404 });
      }
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
    try {
      const fallbackBuf = fs.readFileSync(path.join(process.cwd(), 'public/hero_cake_1778560729107.png'));
      return new NextResponse(fallbackBuf, {
        headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' }
      });
    } catch (e) {
      return new NextResponse('Internal Server Error loading local asset', { status: 500 });
    }
  }
}
