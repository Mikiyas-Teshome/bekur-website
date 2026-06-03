import "reflect-metadata";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env (fallback to .env.local)
config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), ".env.local") });

import { getDataSource } from "../lib/db";
import { User, UserRole } from "../lib/entities/User";
import bcrypt from "bcryptjs";

// Import only entities that exist
import { SiteSetting } from "../lib/entities/SiteSetting";
import { Feature } from "../lib/entities/Feature";
import { Service } from "../lib/entities/Service";
import { TeamMember } from "../lib/entities/TeamMember";
import { Testimonial } from "../lib/entities/Testimonial";
import { Company } from "../lib/entities/Company";
import { Value } from "../lib/entities/Value";
import { Contact } from "../lib/entities/Contact";

// Import JSON data with error handling
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let heroData: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let featuresData: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let servicesData: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let teamData: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let testimonialsData: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let companiesData: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let valuesData: any = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  heroData = import("../data/hero.json");
} catch  {
}

try {
  featuresData = import("../data/features.json");
} catch  {
}

try {
  servicesData = import("../data/services.json");
} catch  {
}

try {
  teamData = import("../data/team.json");
} catch  {
}

try {
  testimonialsData = import("../data/testimonials.json");
} catch  {
}

try {
  companiesData = import("../data/companies.json");
} catch  {
}

try {
  valuesData = import("../data/values.json");
} catch  {
}

async function seed() {
  const dataSource = await getDataSource();

  try {
    // 1. Create admin user (essential)
    const adminPassword = process.env.ADMIN_PASSWORD || "changeme123";
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const userRepository = dataSource.getRepository(User);

    // Check if admin already exists
    const existingAdmin = await userRepository.findOne({
      where: { email: "admin@bekur.com" },
    });

    if (existingAdmin) {
    } else {
      const adminUser = new User();
      adminUser.email = "admin@bekur.com";
      adminUser.passwordHash = hashedPassword;
      adminUser.role = UserRole.ADMIN;

      await userRepository.save(adminUser);
    }

    // 2. Create site settings (essential)
    const siteSettings = [
      {
        key: "contact_info",
        value: {
          email: "bekurtechnologies@gmail.com",
          phone: "+251-912345678",
          linkedin: "https://www.linkedin.com/company/bekur-technologies/",
          officeLocation: "Sebara Babur, Addis Abeba, Ethiopia",
        },
      },
      {
        key: "about_vision",
        value: {
          title: "Our Vision",
          description:
            "We envision a landscape where innovative solutions seamlessly integrate into every facet of life, driving sustainable growth, fostering creativity, and unlocking limitless possibilities for our clients across the globe.",
        },
      },
      {
        key: "about_mission",
        value: {
          title: "Our Mission",
          description:
            "We are dedicated to delivering exceptional value by blending innovative web development, strategic digital marketing, and intuitive design with a relentless commitment to client success.",
        },
      },
    ];

    const siteSettingRepository = dataSource.getRepository(SiteSetting);
    for (const setting of siteSettings) {
      const existingSetting = await siteSettingRepository.findOne({
        where: { key: setting.key },
      });

      if (!existingSetting) {
        const siteSetting = new SiteSetting();
        siteSetting.key = setting.key;
        siteSetting.value = setting.value;
        await siteSettingRepository.save(siteSetting);
      }
    }

    // 3. Create contact information (essential)
    const contactData = [
      {
        title: "Email Address",
        description: "bekurtechnologies@gmail.com",
        iconType: "email",
        isLink: false,
        order: 0,
      },
      {
        title: "Phone Number",
        description: "+251-912345678",
        iconType: "phone",
        isLink: false,
        order: 1,
      },
      {
        title: "LinkedIn",
        description: "https://www.linkedin.com/company/bekur-technologies/",
        iconType: "linkedin",
        isLink: true,
        href: "https://www.linkedin.com/company/bekur-technologies/",
        order: 2,
      },
      {
        title: "Office Location",
        description: "Sebara Babur, Addis Abeba, Ethiopia",
        iconType: "location",
        isLink: false,
        order: 3,
      },
    ];

    const contactRepository = dataSource.getRepository(Contact);
    for (const contactInfo of contactData) {
      const existingContact = await contactRepository.findOne({
        where: { title: contactInfo.title },
      });

      if (!existingContact) {
        const contact = new Contact();
        contact.title = contactInfo.title;
        contact.description = contactInfo.description;
        contact.iconType = contactInfo.iconType as
          | "email"
          | "phone"
          | "linkedin"
          | "location";
        contact.isLink = contactInfo.isLink;
        contact.href = contactInfo.href || "";
        contact.order = contactInfo.order;
        await contactRepository.save(contact);
      }
    }

    // 4. Seed optional data from JSON files

    // Seed Services
    if (servicesData?.services) {
      const serviceRepository = dataSource.getRepository(Service);
      for (let i = 0; i < servicesData.services.length; i++) {
        const serviceData = servicesData.services[i];
        const existingService = await serviceRepository.findOne({
          where: { title: serviceData.title },
        });

        if (!existingService) {
          const service = new Service();
          service.title = serviceData.title;
          service.description = serviceData.description;
          service.iconKey = serviceData.iconKey;
          service.order = parseInt(serviceData.number) - 1;
          service.steps = [];
          await serviceRepository.save(service);
        }
      }
    }

    // Seed Companies
    if (companiesData?.companies) {
      const companyRepository = dataSource.getRepository(Company);
      for (let i = 0; i < companiesData.companies.length; i++) {
        const companyData = companiesData.companies[i];
        const existingCompany = await companyRepository.findOne({
          where: { name: companyData.name },
        });

        if (!existingCompany) {
          const company = new Company();
          company.name = companyData.name;
          company.logo = companyData.logo;
          company.order = companyData.id - 1;
          await companyRepository.save(company);
        }
      }
    }

    // Seed Team Members
    if (teamData?.teamMembers) {
      const teamRepository = dataSource.getRepository(TeamMember);
      for (let i = 0; i < teamData.teamMembers.length; i++) {
        const memberData = teamData.teamMembers[i];
        const existingMember = await teamRepository.findOne({
          where: { name: memberData.name },
        });

        if (!existingMember) {
          const member = new TeamMember();
          member.name = memberData.name;
          member.title =
            memberData.position || memberData.title || "Team Member";
          member.profileImage =
            memberData.image || "/assets/default-avatar.png";
          member.socialLinks = memberData.socialLinks || {};
          member.order = i;
          await teamRepository.save(member);
        }
      }
    }

    // Seed Testimonials
    if (testimonialsData?.testimonials) {
      const testimonialRepository = dataSource.getRepository(Testimonial);
      for (let i = 0; i < testimonialsData.testimonials.length; i++) {
        const testimonialData = testimonialsData.testimonials[i];
        const existingTestimonial = await testimonialRepository.findOne({
          where: { username: testimonialData.username },
        });

        if (!existingTestimonial) {
          const testimonial = new Testimonial();
          testimonial.username = testimonialData.username;
          testimonial.description = testimonialData.description;
          testimonial.joinedDate = testimonialData.joinedDate;
          testimonial.order = i;
          await testimonialRepository.save(testimonial);
        }
      }
    }

    // Seed Features
    if (featuresData?.features) {
      const featureRepository = dataSource.getRepository(Feature);
      for (let i = 0; i < featuresData.features.length; i++) {
        const featureData = featuresData.features[i];
        const existingFeature = await featureRepository.findOne({
          where: { title: featureData.title },
        });

        if (!existingFeature) {
          const feature = new Feature();
          feature.title = featureData.title;
          feature.description = featureData.description;
          feature.order = i;
          await featureRepository.save(feature);
        }
      }
    }

    // Seed Values
    if (valuesData?.values) {
      const valueRepository = dataSource.getRepository(Value);
      for (let i = 0; i < valuesData.values.length; i++) {
        const valueData = valuesData.values[i];
        const existingValue = await valueRepository.findOne({
          where: { title: valueData.title },
        });

        if (!existingValue) {
          const value = new Value();
          value.title = valueData.title;
          value.description = valueData.description;
          value.step = valueData.step;
          value.iconKey = valueData.iconKey;
          value.order = i;
          await valueRepository.save(value);
        }
      }
    }
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await dataSource.destroy();
  }
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

seed().catch((error) => {
  console.error("❌ Seed script failed:", error);
  process.exit(1);
});
