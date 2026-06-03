import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/db';
import { BlogPost } from '@/lib/entities/BlogPost';
import { Media } from '@/lib/entities/Media';
import { Tag } from '@/lib/entities/Tag';
import { verifyToken } from '@/lib/auth';
import { Not, In } from 'typeorm';
import { safeTiptapToHtml } from '@/lib/tiptapToHtml';

export async function GET(
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
    const mediaRepository = dataSource.getRepository(Media);
    const tagRepository = dataSource.getRepository(Tag);
    
    const blog = await blogRepository.findOne({
      where: { id: parseInt(resolvedParams.id) },
    });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // Get cover media object
    let coverMedia = null;
    if (blog.featuredImage) {
      coverMedia = await mediaRepository.findOne({ where: { url: blog.featuredImage } });
    }

    // Get tags objects
    const tagObjects = [];
    if (blog.tags && blog.tags.length > 0) {
      for (const tagName of blog.tags) {
        const tag = await tagRepository.findOne({ where: { name: tagName } });
        if (tag) {
          tagObjects.push(tag);
        }
      }
    }

    // Return blog with proper relations
    const blogWithRelations = {
      ...blog,
      cover: coverMedia,
      tags: tagObjects,
    };

    return NextResponse.json(blogWithRelations);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    const data = await request.json();
    const { title, slug, excerpt, content, coverId, tagIds } = data;

    const dataSource = await getDataSource();
    const blogRepository = dataSource.getRepository(BlogPost);
    const mediaRepository = dataSource.getRepository(Media);
    const tagRepository = dataSource.getRepository(Tag);

    const blog = await blogRepository.findOne({
      where: { id: parseInt(resolvedParams.id) },
    });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // Check if slug already exists (excluding current blog)
    const existingBlog = await blogRepository.findOne({ 
      where: { slug, id: Not(parseInt(resolvedParams.id)) } 
    });
    if (existingBlog) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 400 }
      );
    }

    // Get cover media if provided
    let cover = null;
    if (coverId) {
      cover = await mediaRepository.findOne({ where: { id: coverId } });
    }

    // Get tags
    const tags = tagIds && tagIds.length > 0 
      ? await tagRepository.findBy({ id: In(tagIds) }) 
      : [];

    // Generate HTML from TipTap content
    const html = safeTiptapToHtml(content);

    // Update blog
    blog.title = title;
    blog.slug = slug;
    blog.excerpt = excerpt;
    blog.content = content;
    blog.html = html;
    blog.featuredImage = cover?.url || null;
    blog.isPublished = true;
    blog.publishedAt = new Date();
    blog.tags = tags.map(tag => tag.name);

    await blogRepository.save(blog);

    // Return the updated blog with proper relations
    const updatedBlog = await blogRepository.findOne({
      where: { id: blog.id },
    });

    if (!updatedBlog) {
      return NextResponse.json({ error: 'Failed to retrieve updated blog' }, { status: 500 });
    }

    // Get cover media object
    let coverMedia = null;
    if (updatedBlog.featuredImage) {
      coverMedia = await mediaRepository.findOne({ where: { url: updatedBlog.featuredImage } });
    }

    // Get tags objects
    const tagObjects = [];
    if (updatedBlog.tags && updatedBlog.tags.length > 0) {
      for (const tagName of updatedBlog.tags) {
        const tag = await tagRepository.findOne({ where: { name: tagName } });
        if (tag) {
          tagObjects.push(tag);
        }
      }
    }

    // Return blog with proper relations
    const blogWithRelations = {
      ...updatedBlog,
      cover: coverMedia,
      tags: tagObjects,
    };

    return NextResponse.json(blogWithRelations);
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    await blogRepository.remove(blog);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
