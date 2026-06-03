import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/db';
import { Media } from '@/lib/entities/Media';
import { getAuthenticatedUser } from '@/lib/api-auth';
import { uploadFile } from '@/lib/minio';

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthenticatedUser(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Set a longer timeout for file uploads (increased for large files)
    const timeoutId = setTimeout(() => {}, 900000); // 15 minutes for very large files

    try {
      const formData = await request.formData();
      const file = formData.get('file') as File;

      if (!file) {
        clearTimeout(timeoutId);
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
      }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'video/mp4',
      'video/webm',
      'video/ogg',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'File type not allowed. Allowed types: images, videos, PDFs, and documents' 
      }, { status: 400 });
    }

    // Removed file size limit - allow any size
    // const maxSize = 10 * 1024 * 1024; // 10MB
    // if (file.size > maxSize) {
    //   return NextResponse.json({ 
    //     error: 'File too large. Maximum size is 10MB' 
    //   }, { status: 400 });
    // }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to MinIO
    let uploadedUrl: string;
    try {
      uploadedUrl = await uploadFile(
        buffer,
        file.name,
        file.type
      );
    } catch (uploadError) {
      console.error('MinIO upload failed:', uploadError);
      const errorMessage = uploadError instanceof Error ? uploadError.message : 'MinIO upload failed';
      return NextResponse.json({ 
        error: `Upload to storage failed: ${errorMessage}`,
        details: process.env.NODE_ENV === 'development' ? {
          message: errorMessage,
          stack: uploadError instanceof Error ? uploadError.stack : undefined
        } : undefined
      }, { status: 500 });
    }

    // Get image dimensions if it's an image
    let width: number | null = null;
    let height: number | null = null;

    if (file.type.startsWith('image/')) {
      try {
        const imageSize = await import('image-size');
        const dimensions = imageSize.default(buffer);
        width = dimensions?.width || null;
        height = dimensions?.height || null;
        // Image dimensions obtained successfully
      } catch (error) {
        console.warn('Could not get image dimensions:', error);
        // Continue without dimensions
      }
    }

    // Save to database
    let savedMedia: Media;
    try {
      const dataSource = await getDataSource();
      const mediaRepository = dataSource.getRepository(Media);

      const media = new Media();
      media.url = uploadedUrl;
      media.mime = file.type;
      media.width = width;
      media.height = height;
      media.size = file.size;
      media.alt = file.name.replace(/\.[^/.]+$/, ''); // Remove extension for alt text

      savedMedia = await mediaRepository.save(media);
    } catch (dbError) {
      // Try to delete the uploaded file from MinIO if database save fails
      try {
        const { deleteFile } = await import('@/lib/minio');
        const fileName = uploadedUrl.split('/').pop();
        if (fileName) {
          await deleteFile(fileName);
        }
      } catch (deleteError) {
        console.error('Failed to delete uploaded file after DB error:', deleteError);
      }
      
      const errorMessage = dbError instanceof Error ? dbError.message : 'Database save failed';
      return NextResponse.json({ 
        error: `Failed to save media to database: ${errorMessage}`,
        details: process.env.NODE_ENV === 'development' ? {
          message: errorMessage,
          stack: dbError instanceof Error ? dbError.stack : undefined
        } : undefined
      }, { status: 500 });
    }

      clearTimeout(timeoutId);
      return NextResponse.json(savedMedia, { status: 201 });
    } catch (timeoutError) {
      clearTimeout(timeoutId);
      if (timeoutError instanceof Error && timeoutError.name === 'AbortError') {
        return NextResponse.json({ 
          error: 'Upload timeout. Please try with a smaller file or check your connection.' 
        }, { status: 408 });
      }
      throw timeoutError;
    }
  } catch (error) {
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    return NextResponse.json({ 
      error: 'Upload failed. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
    }, { status: 500 });
  }
}
