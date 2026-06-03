import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/api-auth';


import { getDataSource } from '@/lib/db';
import { Value } from '@/lib/entities/Value';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dataSource = await getDataSource();
    const valueRepository = dataSource.getRepository(Value);

    const values = await valueRepository.find({
      order: { order: 'ASC' },
    });

    return NextResponse.json(values);
  } catch (error) {
    console.error('Error fetching values:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const values = await request.json();
    const dataSource = await getDataSource();
    const valueRepository = dataSource.getRepository(Value);

    // Clear existing values
    await valueRepository.clear();

    // Save new values
    for (const valueData of values) {
      const value = new Value();
      value.title = valueData.title;
      value.description = valueData.description;
      value.step = valueData.step;
      value.iconKey = valueData.iconKey;
      value.order = valueData.order;
      await valueRepository.save(value);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating values:', error);
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
    const valueRepository = dataSource.getRepository(Value);

    const value = new Value();
    value.title = data.title;
    value.description = data.description;
    value.step = data.step;
    value.iconKey = data.iconKey;
    value.order = data.order;

    const savedValue = await valueRepository.save(value);
    return NextResponse.json(savedValue);
  } catch (error) {
    console.error('Error creating value:', error);
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
      return NextResponse.json({ error: 'Value ID is required' }, { status: 400 });
    }

    const dataSource = await getDataSource();
    const valueRepository = dataSource.getRepository(Value);

    await valueRepository.delete(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting value:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
