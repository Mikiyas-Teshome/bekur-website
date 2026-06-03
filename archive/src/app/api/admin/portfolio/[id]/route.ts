import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/db';
import { PortfolioProject } from '@/lib/entities/PortfolioProject';
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
    const portfolioRepository = dataSource.getRepository(PortfolioProject);
    const mediaRepository = dataSource.getRepository(Media);
    const tagRepository = dataSource.getRepository(Tag);
    
    const project = await portfolioRepository.findOne({
      where: { id: parseInt(resolvedParams.id) },
    });

    if (!project) {
      return NextResponse.json({ error: 'Portfolio project not found' }, { status: 404 });
    }

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

    // Return project with proper relations
    const projectWithRelations = {
      ...project,
      gallery: galleryMedia,
      tags: tagObjects,
    };

    return NextResponse.json(projectWithRelations);
  } catch (error) {
    console.error('Error fetching portfolio project:', error);
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
    const { title, slug, shortDescription, content, galleryIds, tagIds, featured } = data;

    const dataSource = await getDataSource();
    const portfolioRepository = dataSource.getRepository(PortfolioProject);
    const mediaRepository = dataSource.getRepository(Media);
    const tagRepository = dataSource.getRepository(Tag);

    const project = await portfolioRepository.findOne({
      where: { id: parseInt(resolvedParams.id) },
    });

    if (!project) {
      return NextResponse.json({ error: 'Portfolio project not found' }, { status: 404 });
    }

    // Check if slug already exists (excluding current project)
    const existingProject = await portfolioRepository.findOne({ 
      where: { slug, id: Not(parseInt(resolvedParams.id)) } 
    });
    if (existingProject) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 400 }
      );
    }

    // Get gallery media if provided
    const gallery = galleryIds && galleryIds.length > 0 
      ? await mediaRepository.findBy({ id: In(galleryIds) }) 
      : [];

    // Get tags
    const tags = tagIds && tagIds.length > 0 
      ? await tagRepository.findBy({ id: In(tagIds) }) 
      : [];

    // Generate HTML from TipTap content
    const html = safeTiptapToHtml(content);

    // Update project
    project.title = title;
    project.slug = slug;
    project.description = shortDescription;
    project.content = content;
    project.html = html;
    project.gallery = gallery.map(media => media.url);
    project.isPublished = true;
    project.publishedAt = new Date();
    project.tags = tags.map(tag => tag.name);
    project.featured = featured || false;

    await portfolioRepository.save(project);

    // Return the updated project with proper relations
    const updatedProject = await portfolioRepository.findOne({
      where: { id: project.id },
    });

    if (!updatedProject) {
      return NextResponse.json({ error: 'Failed to retrieve updated project' }, { status: 500 });
    }

    // Get gallery media objects
    const galleryMedia = [];
    if (updatedProject.gallery && updatedProject.gallery.length > 0) {
      for (const url of updatedProject.gallery) {
        const media = await mediaRepository.findOne({ where: { url } });
        if (media) {
          galleryMedia.push(media);
        }
      }
    }

    // Get tags objects
    const tagObjects = [];
    if (updatedProject.tags && updatedProject.tags.length > 0) {
      for (const tagName of updatedProject.tags) {
        const tag = await tagRepository.findOne({ where: { name: tagName } });
        if (tag) {
          tagObjects.push(tag);
        }
      }
    }

    // Return project with proper relations
    const projectWithRelations = {
      ...updatedProject,
      gallery: galleryMedia,
      tags: tagObjects,
    };

    return NextResponse.json(projectWithRelations);
  } catch (error) {
    console.error('Error updating portfolio project:', error);
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
    const portfolioRepository = dataSource.getRepository(PortfolioProject);
    
    const project = await portfolioRepository.findOne({
      where: { id: parseInt(resolvedParams.id) },
    });

    if (!project) {
      return NextResponse.json({ error: 'Portfolio project not found' }, { status: 404 });
    }

    await portfolioRepository.remove(project);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting portfolio project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
