// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';

// Increase Next.js route timeout
export const maxDuration = 60; // 60 seconds
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    const purpose = formData.get('purpose') as string || 'general';
    
    let folder: string;
    let transformation: any;
    
    switch (purpose) {
      case 'profile':
        folder = 'profiles';
        transformation = {
          width: 400,
          height: 400,
          crop: 'fill',
          gravity: 'face',
          quality: 'auto',
          fetch_format: 'auto'
        };
        break;
      case 'product':
        folder = 'products';
        transformation = {
          width: 1000,
          height: 1000,
          crop: 'limit',
          quality: 'auto',
          fetch_format: 'auto'
        };
        break;
      case 'review':
        folder = 'reviews';
        transformation = {
          width: 800,
          height: 800,
          crop: 'limit',
          quality: 'auto',
          fetch_format: 'auto'
        };
        break;
      default:
        folder = 'disputes';
        transformation = {
          width: 1000,
          height: 1000,
          crop: 'limit',
          quality: 'auto',
          fetch_format: 'auto'
        };
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary with timeout and retry logic
    const uploadPromise = new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `stylish-steps/${folder}`,
          resource_type: 'image',
          transformation,
          timeout: 60000, // 60 second timeout
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(buffer);
    });

    // Add timeout wrapper
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Upload timeout - please try again')), 55000);
    });

    const result = await Promise.race([uploadPromise, timeoutPromise]);

    return NextResponse.json({
      message: 'File uploaded successfully',
      url: result.secure_url,
      filename: result.public_id,
    });

  } catch (error: any) {
    console.error('Error uploading file:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to upload file';
    
    if (error.code === 'ECONNRESET') {
      errorMessage = 'Connection lost during upload. Please check your internet and try again.';
    } else if (error.message?.includes('timeout')) {
      errorMessage = 'Upload timed out. Please try a smaller image or check your connection.';
    } else if (error.http_code) {
      errorMessage = `Cloudinary error: ${error.message || 'Upload failed'}`;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}