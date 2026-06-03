import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/db';
import { BlogPost } from '@/lib/entities/BlogPost';
import { verifyToken } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Resolve params
    const resolvedParams = await params;
    
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
    const blogRepository = dataSource.getRepository(BlogPost);
    
    const blog = await blogRepository.findOne({
      where: { id: parseInt(resolvedParams.id) },
    });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // Publish the blog
    blog.isPublished = true;
    blog.publishedAt = new Date();

    await blogRepository.save(blog);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error publishing blog:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
