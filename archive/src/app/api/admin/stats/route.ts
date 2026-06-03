import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/api-auth';
import { getDataSource } from '@/lib/db';
import { BlogPost } from '@/lib/entities/BlogPost';
import { PortfolioProject } from '@/lib/entities/PortfolioProject';
import { Media } from '@/lib/entities/Media';
import { Feature } from '@/lib/entities/Feature';
import { Service } from '@/lib/entities/Service';
import { TeamMember } from '@/lib/entities/TeamMember';
import { Testimonial } from '@/lib/entities/Testimonial';
import { Company } from '@/lib/entities/Company';
import { Value } from '@/lib/entities/Value';
import { PricingPlan } from '@/lib/entities/PricingPlan';

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthenticatedUser(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dataSource = await getDataSource();

    // Fetch counts for all content types
    const [
      blogCount,
      projectCount,
      mediaCount,
      featureCount,
      serviceCount,
      teamMemberCount,
      testimonialCount,
      companyCount,
      valueCount,
      pricingPlanCount,
    ] = await Promise.all([
      dataSource.getRepository(BlogPost).count(),
      dataSource.getRepository(PortfolioProject).count(),
      dataSource.getRepository(Media).count(),
      dataSource.getRepository(Feature).count(),
      dataSource.getRepository(Service).count(),
      dataSource.getRepository(TeamMember).count(),
      dataSource.getRepository(Testimonial).count(),
      dataSource.getRepository(Company).count(),
      dataSource.getRepository(Value).count(),
      dataSource.getRepository(PricingPlan).count(),
    ]);

    // Calculate total content items
    const totalContentItems = 
      blogCount +
      projectCount +
      mediaCount +
      featureCount +
      serviceCount +
      teamMemberCount +
      testimonialCount +
      companyCount +
      valueCount +
      pricingPlanCount;

    // Get published blog count
    const publishedBlogCount = await dataSource
      .getRepository(BlogPost)
      .count({ where: { isPublished: true } });

    return NextResponse.json({
      totalContentItems,
      blogPosts: blogCount,
      publishedBlogPosts: publishedBlogCount,
      portfolioProjects: projectCount,
      mediaFiles: mediaCount,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

