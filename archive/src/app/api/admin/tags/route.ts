import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/db';
import { Tag } from '@/lib/entities/Tag';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const dataSource = await getDataSource();
    const tagRepository = dataSource.getRepository(Tag);
    
    const tags = await tagRepository.find({
      order: { name: 'ASC' },
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const data = await request.json();
    const { name } = data;

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Tag name is required' },
        { status: 400 }
      );
    }

    const dataSource = await getDataSource();
    const tagRepository = dataSource.getRepository(Tag);

    // Check if tag already exists
    const existingTag = await tagRepository.findOne({ 
      where: { name: name.trim() } 
    });
    if (existingTag) {
      return NextResponse.json(
        { error: 'Tag already exists' },
        { status: 400 }
      );
    }

    const tag = tagRepository.create({
      name: name.trim(),
      slug: name.trim().toLowerCase().replace(/\s+/g, '-'),
    });

    await tagRepository.save(tag);

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
