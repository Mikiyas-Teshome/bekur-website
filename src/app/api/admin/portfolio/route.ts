import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/db';
import { PortfolioProject } from '@/lib/entities/PortfolioProject';
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
    const portfolioRepository = dataSource.getRepository(PortfolioProject);
    const mediaRepository = dataSource.getRepository(Media);
    const tagRepository = dataSource.getRepository(Tag);
    
    const projects = await portfolioRepository.find({
      order: { updatedAt: 'DESC' },
    });

    // Transform projects to include proper relations
    const projectsWithRelations = await Promise.all(
      projects.map(async (project) => {
        // Get gallery media objects
        const galleryMedia = [];
        if (project.gallery && project.gallery.length > 0) {
          for (const url of project.gallery) {
            const media = await mediaRepository.findOne({ where: { url } });
            if (media) {
              galleryMedia.push(media);
            }
          }
        }

        // Get tags objects
        const tagObjects = [];
        if (project.tags && project.tags.length > 0) {
          for (const tagName of project.tags) {
            const tag = await tagRepository.findOne({ where: { name: tagName } });
            if (tag) {
              tagObjects.push(tag);
            }
          }
        }

        return {
          ...project,
          gallery: galleryMedia,
          tags: tagObjects,
        };
      })
    );

    return NextResponse.json(projectsWithRelations);
  } catch (error) {
    console.error('Error fetching portfolio projects:', error);
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
    const { title, slug, shortDescription, content, galleryIds, tagIds, featured } = data;

    const dataSource = await getDataSource();
    const portfolioRepository = dataSource.getRepository(PortfolioProject);
    const mediaRepository = dataSource.getRepository(Media);
    const tagRepository = dataSource.getRepository(Tag);

    // Check if slug already exists
    const existingProject = await portfolioRepository.findOne({ where: { slug } });
    if (existingProject) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 400 }
      );
    }

    // Get gallery media if provided
    const gallery = galleryIds ? await mediaRepository.findByIds(galleryIds) : [];

    // Get tags
    const tags = tagIds ? await tagRepository.findByIds(tagIds) : [];

    // Generate HTML from TipTap content
    const html = safeTiptapToHtml(content);

    const project = portfolioRepository.create({
      title,
      slug,
      description: shortDescription,
      content,
      html,
      gallery: gallery.map(media => media.url),
      isPublished: true,
      publishedAt: new Date(),
      tags: tags.map(tag => tag.name),
      featured: featured || false,
    });

    await portfolioRepository.save(project);

    // Return the created project
    const savedProject = await portfolioRepository.findOne({
      where: { id: project.id },
    });

    return NextResponse.json(savedProject, { status: 201 });
  } catch (error) {
    console.error('Error creating portfolio project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
