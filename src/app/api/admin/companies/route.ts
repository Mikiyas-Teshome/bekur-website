import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/api-auth";
import { getDataSource } from "@/lib/db";
import { Company } from "@/lib/entities/Company";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dataSource = await getDataSource();
    const companyRepository = dataSource.getRepository(Company);

    const companies = await companyRepository.find({
      order: { order: "ASC" },
    });

    return NextResponse.json(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const companies = await request.json();
    const dataSource = await getDataSource();
    const companyRepository = dataSource.getRepository(Company);

    // Clear existing companies
    await companyRepository.clear();

    // Save new companies
    for (const companyData of companies) {
      const company = new Company();
      company.name = companyData.name;
      company.logo = companyData.logo;
      company.darkLogo = companyData.darkLogo || null;
      company.order = companyData.order;
      await companyRepository.save(company);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating companies:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const dataSource = await getDataSource();
    const companyRepository = dataSource.getRepository(Company);

    const company = new Company();
    company.name = data.name;
    company.logo = data.logo;
    company.darkLogo = data.darkLogo || null;
    company.order = data.order;

    const savedCompany = await companyRepository.save(company);
    return NextResponse.json(savedCompany);
  } catch (error) {
    console.error("Error creating company:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    const dataSource = await getDataSource();
    const companyRepository = dataSource.getRepository(Company);

    await companyRepository.delete(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting company:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
