import "reflect-metadata";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env (fallback to .env.local)
config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), ".env.local") });

import { getDataSource } from "../lib/db";
import { User, UserRole } from "../lib/entities/User";
import bcrypt from "bcryptjs";

// Import only entities that exist in the main DataSource
import { Feature } from "../lib/entities/Feature";
import { Service } from "../lib/entities/Service";
import { TeamMember } from "../lib/entities/TeamMember";
import { Testimonial } from "../lib/entities/Testimonial";
import { Company } from "../lib/entities/Company";
import { Value } from "../lib/entities/Value";
import { Contact } from "../lib/entities/Contact";
import { BlogPost } from "../lib/entities/BlogPost";
import { PortfolioProject } from "../lib/entities/PortfolioProject";

// Import JSON data with error handling
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let blogsData: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let worksData: any = null;

async function loadJsonData() {
  try {
  } catch  {
  }

  try {
    featuresData = await import("../data/features.json");
  } catch  {
  }

  try {
    servicesData = await import("../data/services.json");
  } catch  {
  }

  try {
    teamData = await import("../data/team.json");
  } catch  {
  }

  try {
    testimonialsData = await import("../data/testimonials.json");
  } catch  {
  }

  try {
    companiesData = await import("../data/companies.json");
  } catch  {
  }

  try {
    valuesData = await import("../data/values.json");
  } catch  {
  }

  try {
    blogsData = await import("../data/blogs.json");
  } catch  {
  }

  try {
    worksData = await import("../data/works.json");
  } catch  {
  }
}

async function seed() {
  const dataSource = await getDataSource();

  // Load JSON data first
  await loadJsonData();

  try {
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

    // 2. Create contact information (essential)
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

    // 3. Seed optional data from JSON files
    if (servicesData?.default?.services) {
      const serviceRepository = dataSource.getRepository(Service);
      for (let i = 0; i < servicesData.default.services.length; i++) {
        const serviceData = servicesData.default.services[i];
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
    if (companiesData?.default?.companies) {
      const companyRepository = dataSource.getRepository(Company);
      for (let i = 0; i < companiesData.default.companies.length; i++) {
        const companyData = companiesData.default.companies[i];
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
    if (teamData?.default?.teamMembers) {
      const teamRepository = dataSource.getRepository(TeamMember);
      for (let i = 0; i < teamData.default.teamMembers.length; i++) {
        const memberData = teamData.default.teamMembers[i];
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
    if (testimonialsData?.default?.testimonials) {
      const testimonialRepository = dataSource.getRepository(Testimonial);
      for (let i = 0; i < testimonialsData.default.testimonials.length; i++) {
        const testimonialData = testimonialsData.default.testimonials[i];
        const existingTestimonial = await testimonialRepository.findOne({
          where: { username: testimonialData.username },
        });

        if (!existingTestimonial) {
          const testimonial = new Testimonial();
          testimonial.profileImage =
            testimonialData.profileImage || "/assets/default-avatar.png";
          testimonial.username = testimonialData.username;
          testimonial.description = testimonialData.description;
          testimonial.joinedDate = testimonialData.joinedDate;
          testimonial.order = i;
          await testimonialRepository.save(testimonial);
        }
      }
    }

    // Seed Features
    if (featuresData?.default?.features) {
      const featureRepository = dataSource.getRepository(Feature);
      for (let i = 0; i < featuresData.default.features.length; i++) {
        const featureData = featuresData.default.features[i];
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
    if (valuesData?.default?.values) {
      const valueRepository = dataSource.getRepository(Value);
      for (let i = 0; i < valuesData.default.values.length; i++) {
        const valueData = valuesData.default.values[i];
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

    // Seed Blog Posts
    if (blogsData?.default?.homePageBlogs) {
      const blogRepository = dataSource.getRepository(BlogPost);
      for (let i = 0; i < blogsData.default.homePageBlogs.length; i++) {
        const blogData = blogsData.default.homePageBlogs[i];
        const existingBlog = await blogRepository.findOne({
          where: { slug: `blog-${blogData.id}` },
        });

        if (!existingBlog) {
          const blog = new BlogPost();
          blog.slug = `blog-${blogData.id}`;
          blog.title = blogData.headline;
          blog.excerpt = blogData.subtitle;
          blog.content = { content: blogData.subtitle };
          blog.html = `<p>${blogData.subtitle}</p>`;
          blog.featuredImage = blogData.blogUrl;
          blog.tags = [blogData.tag];
          blog.isPublished = true;
          blog.publishedAt = new Date();
          await blogRepository.save(blog);
        }
      }
    }

    // Seed Portfolio Projects
    if (worksData?.default?.works) {
      const projectRepository = dataSource.getRepository(PortfolioProject);
      for (let i = 0; i < worksData.default.works.length; i++) {
        const workData = worksData.default.works[i];
        const existingProject = await projectRepository.findOne({
          where: { slug: `project-${workData.id}` },
        });

        if (!existingProject) {
          const project = new PortfolioProject();
          project.slug = `project-${workData.id}`;
          project.title = workData.title;
          project.description = workData.description;
          project.content = { content: workData.description };
          project.html = `<p>${workData.description}</p>`;
          project.gallery = [workData.image];
          project.image = workData.image;
          project.tags = [workData.category];
          project.category = workData.category;
          project.isPublished = true;
          project.publishedAt = new Date();
          await projectRepository.save(project);
        }
      }
    }

    const blogRepository = dataSource.getRepository(BlogPost);
    
    const allBlogs = await blogRepository.find({
      order: { createdAt: "DESC" },
    });
    
    const publishedBlogs = await blogRepository.find({
      where: { isPublished: true },
      order: { createdAt: "DESC" },
    });
    
    
    const unpublishedBlogs = await blogRepository.find({
      where: { isPublished: false },
      order: { createdAt: "DESC" },
    });
    
    if (unpublishedBlogs.length > 0) {
      unpublishedBlogs.forEach(blog => {
      });
      
      for (const blog of unpublishedBlogs) {
        blog.isPublished = true;
        blog.publishedAt = new Date();
        await blogRepository.save(blog);
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
