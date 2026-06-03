import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/api-auth';
import { getDataSource } from '@/lib/db';
import { HeroSection } from '@/lib/entities/HeroSection';

export async function GET() {
  try {
    const dataSource = await getDataSource();
    const heroRepository = dataSource.getRepository(HeroSection);

    let hero = await heroRepository.findOne({ where: {} });

    if (!hero) {
      // Create default hero section if none exists
      hero = new HeroSection();
      hero.headline = {
        main: 'Transform Your',
        highlight: 'Business',
        ending: 'With',
        subtitle: 'Digital Innovation.'
      };
      hero.description = {
        mobile: 'We are dedicated to delivering exceptional value...',
        desktop: 'We are dedicated to delivering exceptional value...'
      };
      hero.video = {
        thumbnail: '',
        alt: 'Hero Video',
        youtubeUrl: ''
      };
      hero.clientSatisfaction = {
        count: '3K+',
        label: 'Satisfied Clients',
        avatars: []
      };
      hero.socialPlatforms = [];
      hero.background = {
        image: '',
        size: 'cover',
        position: 'center',
        repeat: 'no-repeat'
      };
      await heroRepository.save(hero);
    }

    return NextResponse.json(hero);
  } catch (error) {
    console.error('Error fetching hero data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const dataSource = await getDataSource();
    const heroRepository = dataSource.getRepository(HeroSection);

    let hero = await heroRepository.findOne({ where: {} });
    
    if (!hero) {
      hero = new HeroSection();
    }

    // Update hero data with new structure
    hero.headline = data.headline;
    hero.description = data.description;
    hero.video = data.video;
    hero.clientSatisfaction = data.clientSatisfaction;
    hero.socialPlatforms = data.socialPlatforms;
    hero.background = data.background;

    await heroRepository.save(hero);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating hero data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
