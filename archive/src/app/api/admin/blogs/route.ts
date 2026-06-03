import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/db';
import { BlogPost } from '@/lib/entities/BlogPost';
import { Media } from '@/lib/entities/Media';
import { Tag } from '@/lib/entities/Tag';
import { verifyToken } from '@/lib/auth';
import { safeTiptapToHtml } from '@/lib/tiptapToHtml';

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
    const blogRepository = dataSource.getRepository(BlogPost);
    const mediaRepository = dataSource.getRepository(Media);
    const tagRepository = dataSource.getRepository(Tag);
    
    const blogs = await blogRepository.find({
      order: { updatedAt: 'DESC' },
    });

    // Transform blogs to include proper relations
    const blogsWithRelations = await Promise.all(
      blogs.map(async (blog) => {
        try {
          // Get cover media object
          let coverMedia = null;
          if (blog.featuredImage && typeof blog.featuredImage === 'string') {
            coverMedia = await mediaRepository.findOne({ where: { url: blog.featuredImage } });
          }

          // Get tags objects
          const tagObjects = [];
          if (blog.tags && Array.isArray(blog.tags) && blog.tags.length > 0) {
            for (const tagName of blog.tags) {
              if (typeof tagName === 'string') {
                const tag = await tagRepository.findOne({ where: { name: tagName } });
                if (tag) {
                  tagObjects.push(tag);
                }
              }
            }
          }

          return {
            ...blog,
            cover: coverMedia,
            tags: tagObjects,
          };
        } catch (error) {
          console.error(`Error processing blog ${blog.id}:`, error);
          // Return blog with empty relations if there's an error
          return {
            ...blog,
            cover: null,
            tags: [],
          };
        }
      })
    );

    return NextResponse.json(blogsWithRelations);
  } catch (error) {
    console.error('Error fetching blogs:', error);
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
    const { title, slug, excerpt, content, coverId, tagIds } = data;

    const dataSource = await getDataSource();
    const blogRepository = dataSource.getRepository(BlogPost);
    const mediaRepository = dataSource.getRepository(Media);
    const tagRepository = dataSource.getRepository(Tag);

    // Check if slug already exists
    const existingBlog = await blogRepository.findOne({ where: { slug } });
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
    const tags = tagIds ? await tagRepository.findByIds(tagIds) : [];

    // Generate HTML from TipTap content
    const html = safeTiptapToHtml(content);

    const blog = blogRepository.create({
      title,
      slug,
      excerpt,
      content,
      html,
      featuredImage: cover?.url || null,
      isPublished: true,
      publishedAt: new Date(),
      tags: tags.map(tag => tag.name),
    });

    await blogRepository.save(blog);

    // Return the created blog
    const savedBlog = await blogRepository.findOne({
      where: { id: blog.id },
    });

    return NextResponse.json(savedBlog, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
