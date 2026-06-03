import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/db';
import { Media } from '@/lib/entities/Media';
import { getAuthenticatedUser } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthenticatedUser(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dataSource = await getDataSource();
    const mediaRepository = dataSource.getRepository(Media);

    const media = await mediaRepository.find({
      order: { createdAt: 'DESC' },
    });

    return NextResponse.json(media);
  } catch (error) {
    console.error('Error fetching media:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthenticatedUser(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { url, mime, width, height, size, alt } = data;

    const dataSource = await getDataSource();
    const mediaRepository = dataSource.getRepository(Media);

    const media = new Media();
    media.url = url;
    media.mime = mime;
    media.width = width || null;
    media.height = height || null;
    media.size = size || null;
    media.alt = alt || null;

    const savedMedia = await mediaRepository.save(media);
    return NextResponse.json(savedMedia, { status: 201 });
  } catch (error) {
    console.error('Error creating media:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
