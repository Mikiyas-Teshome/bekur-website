import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/api-auth";
import { getDataSource } from "@/lib/db";
import { Service } from "@/lib/entities/Service";

export async function GET() {
  try {
    const dataSource = await getDataSource();
    const serviceRepository = dataSource.getRepository(Service);

    const services = await serviceRepository.find({
      order: { order: "ASC" },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
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

    const services = await request.json();
    const dataSource = await getDataSource();
    const serviceRepository = dataSource.getRepository(Service);

    // Get all existing services and delete them individually
    const existingServices = await serviceRepository.find();
    for (const service of existingServices) {
      await serviceRepository.delete(service.id);
    }

    // Save new services
    for (const serviceData of services) {
      const service = new Service();
      service.number = serviceData.number;
      service.title = serviceData.title;
      service.description = serviceData.description;
      service.iconKey = serviceData.iconKey;
      service.order = serviceData.order;
      service.steps = serviceData.steps || [];
      await serviceRepository.save(service);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating services:", error);
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
    const serviceRepository = dataSource.getRepository(Service);

    const service = new Service();
    service.number = data.number;
    service.title = data.title;
    service.description = data.description;
    service.iconKey = data.iconKey;
    service.order = data.order;
    service.steps = data.steps || [];

    const savedService = await serviceRepository.save(service);
    return NextResponse.json(savedService);
  } catch (error) {
    console.error("Error creating service:", error);
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
        { error: "Service ID is required" },
        { status: 400 }
      );
    }

    const dataSource = await getDataSource();
    const serviceRepository = dataSource.getRepository(Service);

    await serviceRepository.delete(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
