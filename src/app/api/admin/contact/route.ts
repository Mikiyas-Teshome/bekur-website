import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/api-auth";
import { getDataSource } from "@/lib/db";
import { Contact } from "@/lib/entities/Contact";

interface ContactData {
  title: string;
  description: string;
  iconType: string;
  isLink: boolean;
  href: string;
}

export async function GET() {
  try {
    const dataSource = await getDataSource();

    if (!dataSource || !dataSource.isInitialized) {
      console.error("DataSource is not available or initialized");
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    const contactRepository = dataSource.getRepository(Contact);

    const contacts = await contactRepository.find({
      order: { order: "ASC" },
    });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getAuthenticatedUser(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const dataSource = await getDataSource();

    if (!dataSource || !dataSource.isInitialized) {
      console.error("DataSource is not available or initialized");
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    const contactRepository = dataSource.getRepository(Contact);

    // Clear existing contacts
    await contactRepository.clear();

    // Save new contacts
    const contacts = data.map((contact: ContactData, index: number) => {
      const newContact = new Contact();
      newContact.title = contact.title;
      newContact.description = contact.description;
      newContact.iconType = contact.iconType;
      newContact.isLink = contact.isLink;
      newContact.href = contact.href;
      newContact.order = index;
      return newContact;
    });

    await contactRepository.save(contacts);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating contacts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
