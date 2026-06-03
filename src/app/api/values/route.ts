import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/db";
import { Value } from "@/lib/entities/Value";

export const runtime = "nodejs";

export async function GET() {
  try {
    const dataSource = await getDataSource();
    const valueRepository = dataSource.getRepository(Value);

    const values = await valueRepository.find({
      order: { order: "ASC" },
    });

    return NextResponse.json({ values });
  } catch (error) {
    console.error("Error fetching values:", error);
    return NextResponse.json(
      { error: "Failed to fetch values" },
      { status: 500 }
    );
  }
}
