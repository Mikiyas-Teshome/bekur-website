import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/api-auth';
import { getDataSource } from '@/lib/db';
import { Feature } from '@/lib/entities/Feature';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dataSource = await getDataSource();
    const featureRepository = dataSource.getRepository(Feature);

    const features = await featureRepository.find({
      order: { order: 'ASC' },
    });

    return NextResponse.json(features);
  } catch (error) {
    console.error('Error fetching features:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const features = await request.json();
    const dataSource = await getDataSource();
    const featureRepository = dataSource.getRepository(Feature);

    // Clear existing features
    await featureRepository.clear();

    // Save new features
    for (const featureData of features) {
      const feature = new Feature();
      feature.title = featureData.title;
      feature.description = featureData.description;
      feature.order = featureData.order;
      await featureRepository.save(feature);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating features:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const dataSource = await getDataSource();
    const featureRepository = dataSource.getRepository(Feature);

    const feature = new Feature();
    feature.title = data.title;
    feature.description = data.description;
    feature.order = data.order;

    const savedFeature = await featureRepository.save(feature);
    return NextResponse.json(savedFeature);
  } catch (error) {
    console.error('Error creating feature:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Feature ID is required' }, { status: 400 });
    }

    const dataSource = await getDataSource();
    const featureRepository = dataSource.getRepository(Feature);

    await featureRepository.delete(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting feature:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
