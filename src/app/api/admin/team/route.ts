import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/api-auth';


import { getDataSource } from '@/lib/db';
import { TeamMember } from '@/lib/entities/TeamMember';

export async function GET() {
  try {
    const dataSource = await getDataSource();
    const teamRepository = dataSource.getRepository(TeamMember);

    const teamMembers = await teamRepository.find({
      order: { order: 'ASC' },
    });

    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const teamMembers = await request.json();
    const dataSource = await getDataSource();
    const teamRepository = dataSource.getRepository(TeamMember);

    // Clear existing team members
    await teamRepository.clear();

    // Save new team members
    for (const memberData of teamMembers) {
      const member = new TeamMember();
      member.profileImage = memberData.profileImage;
      member.name = memberData.name;
      member.title = memberData.title;
      member.socialLinks = memberData.socialLinks || {};
      member.order = memberData.order;
      await teamRepository.save(member);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating team members:', error);
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
    const teamRepository = dataSource.getRepository(TeamMember);

    const member = new TeamMember();
    member.profileImage = data.profileImage;
    member.name = data.name;
    member.title = data.title;
    member.socialLinks = data.socialLinks || {};
    member.order = data.order;

    const savedMember = await teamRepository.save(member);
    return NextResponse.json(savedMember);
  } catch (error) {
    console.error('Error creating team member:', error);
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
      return NextResponse.json({ error: 'Team member ID is required' }, { status: 400 });
    }

    const dataSource = await getDataSource();
    const teamRepository = dataSource.getRepository(TeamMember);

    await teamRepository.delete(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
