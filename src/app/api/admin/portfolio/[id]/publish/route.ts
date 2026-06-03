import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/db';
import { PortfolioProject } from '@/lib/entities/PortfolioProject';
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
    const portfolioRepository = dataSource.getRepository(PortfolioProject);
    
    const project = await portfolioRepository.findOne({
      where: { id: parseInt(resolvedParams.id) },
    });

    if (!project) {
      return NextResponse.json({ error: 'Portfolio project not found' }, { status: 404 });
    }

    // Publish the project
    // project.status = ProjectStatus.PUBLISHED;
    project.publishedAt = new Date();

    await portfolioRepository.save(project);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error publishing portfolio project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
