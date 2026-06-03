import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/db';
import { Media } from '@/lib/entities/Media';
import { getAuthenticatedUser } from '@/lib/api-auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthenticatedUser(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dataSource = await getDataSource();
    const mediaRepository = dataSource.getRepository(Media);
    
    const mediaItems = await mediaRepository.find();
    let updatedCount = 0;

    for (const media of mediaItems) {
      if (media.url.includes('localhost:9000')) {
        const newUrl = media.url.replace('http://localhost:9000', 'http://84.247.182.225:9000');
        media.url = newUrl;
        await mediaRepository.save(media);
        updatedCount++;
      }
    }

    return NextResponse.json({ 
      message: `Updated ${updatedCount} media URLs`,
      updatedCount 
    });
  } catch (error) {
    console.error('Error fixing media URLs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
