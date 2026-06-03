import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/db';
import { Company } from '@/lib/entities/Company';
import { verifyToken } from '@/lib/auth';

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
    const companyRepository = dataSource.getRepository(Company);
    
    const company = await companyRepository.findOne({
      where: { id: parseInt(resolvedParams.id) },
      relations: ['logo'],
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json(company);
  } catch (error) {
    console.error('Error fetching company:', error);
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
    const { name, description, website, logo, darkLogo, location, industry, size, founded, isActive, isFeatured, order } = data;

    const dataSource = await getDataSource();
    const companyRepository = dataSource.getRepository(Company);

    const company = await companyRepository.findOne({
      where: { id: parseInt(resolvedParams.id) },
      relations: ['logo'],
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Update company
    company.name = name;
    company.description = description;
    company.website = website;
    company.logo = logo;
    company.darkLogo = darkLogo || null;
    company.location = location;
    company.industry = industry;
    company.size = size;
    company.founded = founded;
    company.isActive = isActive;
    company.isFeatured = isFeatured;
    company.order = order;

    await companyRepository.save(company);

    // Return the updated company with relations
    const updatedCompany = await companyRepository.findOne({
      where: { id: company.id },
      relations: ['logo'],
    });

    return NextResponse.json(updatedCompany);
  } catch (error) {
    console.error('Error updating company:', error);
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
    const companyRepository = dataSource.getRepository(Company);
    
    const company = await companyRepository.findOne({
      where: { id: parseInt(resolvedParams.id) },
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    await companyRepository.remove(company);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting company:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
