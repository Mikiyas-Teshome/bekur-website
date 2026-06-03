import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/db';
import { Media } from '@/lib/entities/Media';
import { getAuthenticatedUser } from '@/lib/api-auth';
import { deleteFile } from '@/lib/minio';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthenticatedUser(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const dataSource = await getDataSource();
    const mediaRepository = dataSource.getRepository(Media);

    const media = await mediaRepository.findOne({ where: { id: parseInt(id) } });
    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    // Extract filename from URL for MinIO deletion
    const urlParts = media.url.split('/');
    const fileName = urlParts[urlParts.length - 1];

    try {
      // Delete from MinIO
      await deleteFile(fileName);
    } catch (error) {
      console.warn('Failed to delete file from MinIO:', error);
      // Continue with database deletion even if MinIO deletion fails
    }

    // Delete from database
    await mediaRepository.delete(parseInt(id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthenticatedUser(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();
    const { alt } = data;

    const dataSource = await getDataSource();
    const mediaRepository = dataSource.getRepository(Media);

    const media = await mediaRepository.findOne({ where: { id: parseInt(id) } });
    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    media.alt = alt || null;
    await mediaRepository.save(media);

    return NextResponse.json(media);
  } catch (error) {
    console.error('Error updating media:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
