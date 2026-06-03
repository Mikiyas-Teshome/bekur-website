import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/db";
import { TeamMember } from "@/lib/entities/TeamMember";

export const runtime = "nodejs";

export async function GET() {
  try {
    const dataSource = await getDataSource();
    
    if (!dataSource || !dataSource.isInitialized) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    const teamRepository = dataSource.getRepository(TeamMember);

    const teamMembers = await teamRepository.find({
      order: { order: "ASC" },
    });

    return NextResponse.json({ teamMembers });
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}
