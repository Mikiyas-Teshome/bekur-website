import "reflect-metadata";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

import { getDataSource } from "../lib/db";
import { User, UserRole } from "../lib/entities/User";
import { SiteSetting } from "../lib/entities/SiteSetting";
import { HeroSection } from "../lib/entities/HeroSection";
import { Feature } from "../lib/entities/Feature";
import { Service } from "../lib/entities/Service";
import { TeamMember } from "../lib/entities/TeamMember";
import { Testimonial } from "../lib/entities/Testimonial";
import { Company } from "../lib/entities/Company";
import { Value } from "../lib/entities/Value";
import {
  PricingPlan,
  PricingType,
  Platform,
} from "../lib/entities/PricingPlan";
import { Contact } from "../lib/entities/Contact";
import { BlogPost } from "../lib/entities/BlogPost";
import { DataSource } from "typeorm";

// Import JSON data
import heroData from "../data/hero.json";
import featuresData from "../data/features.json";
import servicesData from "../data/services.json";
import teamData from "../data/team.json";
import testimonialsData from "../data/testimonials.json";
import companiesData from "../data/companies.json";
import valuesData from "../data/values.json";
import blogsData from "../data/blogs.json";

import bcrypt from "bcryptjs";

async function seedPricingPlans(dataSource: DataSource) {
  const pricingRepository = dataSource.getRepository(PricingPlan);

  // Clear existing pricing plans
  await pricingRepository.clear();

  // Get all services to map names to IDs
  const services = await dataSource.getRepository(Service).find();
  const serviceMap = services.reduce(
    (acc: Record<string, number>, service: Service) => {
      acc[service.title] = service.id;
      return acc;
    },
    {}
  );

  // Service IDs mapping
  const serviceIds = {
    "Digital Marketing": serviceMap["Digital Marketing"] || 1,
    "Graphics Design": serviceMap["Graphics Design"] || 2,
    "App Development": serviceMap["App Development"] || 3,
    "UI/UX Design": serviceMap["UI/UX Design"] || 4,
    "Website Development": serviceMap["Website Development"] || 5,
    "Social Media Management": serviceMap["Social Media Management"] || 6,
    Outsourcing: serviceMap["Outsourcing"] || 7,
  };

  const allPricingPlans = [
    // ===== DIGITAL MARKETING (Platform-based pricing) =====
    // Facebook Plans
    {
      name: "Free",
      price: "0",
      period: "monthly",
      features: [
        "Basic Facebook page setup",
        "Content calendar",
        "Basic analytics",
        "Up to 5 posts per month",
      ],
      highlight: false,
      order: 1,
      serviceId: serviceIds["Digital Marketing"],
      pricingType: PricingType.PLATFORM_BASED,
      platform: Platform.FACEBOOK,
      subtitle: "per user/month, billed annually",
      targetAudience: "For Small Businesses",
      buttonText: "Get Started",
    },
    {
      name: "Basic",
      price: "39",
      discount: "15",
      period: "monthly",
      features: [
        "Facebook ads management",
        "Advanced analytics",
        "Content creation",
        "Community management",
        "Up to 20 posts per month",
      ],
      highlight: false,
      order: 2,
      serviceId: serviceIds["Digital Marketing"],
      pricingType: PricingType.PLATFORM_BASED,
      platform: Platform.FACEBOOK,
      subtitle: "per user/month, billed annually",
      targetAudience: "For Growing Businesses",
      buttonText: "Get Started",
    },
    {
      name: "Pro",
      price: "59",
      discount: "15",
      period: "monthly",
      features: [
        "Advanced Facebook ads",
        "Custom audiences",
        "A/B testing",
        "Priority support",
        "Unlimited posts",
      ],
      highlight: true,
      order: 3,
      serviceId: serviceIds["Digital Marketing"],
      pricingType: PricingType.PLATFORM_BASED,
      platform: Platform.FACEBOOK,
      subtitle: "per user/month, billed annually",
      targetAudience: "For Scaling Businesses",
      buttonText: "Get Started",
    },
    {
      name: "Enterprise",
      price: "129",
      period: "monthly",
      features: [
        "White-label solutions",
        "Custom integrations",
        "Dedicated account manager",
        "Advanced reporting",
        "Multi-account management",
      ],
      highlight: false,
      order: 4,
      serviceId: serviceIds["Digital Marketing"],
      pricingType: PricingType.PLATFORM_BASED,
      platform: Platform.FACEBOOK,
      subtitle: "per user/month, billed annually",
      targetAudience: "For Large Corporations",
      buttonText: "Contact Sales",
    },

    // LinkedIn Plans
    {
      name: "Free",
      price: "0",
      period: "monthly",
      features: [
        "LinkedIn profile optimization",
        "Basic content posting",
        "Network growth tips",
        "Up to 5 posts per month",
      ],
      highlight: false,
      order: 1,
      serviceId: serviceIds["Digital Marketing"],
      pricingType: PricingType.PLATFORM_BASED,
      platform: Platform.LINKEDIN,
      subtitle: "per user/month, billed annually",
      targetAudience: "For Professionals",
      buttonText: "Get Started",
    },
    {
      name: "Basic",
      price: "45",
      discount: "15",
      period: "monthly",
      features: [
        "LinkedIn ads management",
        "Lead generation",
        "Content strategy",
        "Analytics dashboard",
        "Up to 20 posts per month",
      ],
      highlight: false,
      order: 2,
      serviceId: serviceIds["Digital Marketing"],
      pricingType: PricingType.PLATFORM_BASED,
      platform: Platform.LINKEDIN,
      subtitle: "per user/month, billed annually",
      targetAudience: "For B2B Companies",
      buttonText: "Get Started",
    },
    {
      name: "Pro",
      price: "79",
      discount: "15",
      period: "monthly",
      features: [
        "Advanced LinkedIn campaigns",
        "Sales Navigator integration",
        "Automated outreach",
        "Custom reporting",
        "Unlimited posts",
      ],
      highlight: true,
      order: 3,
      serviceId: serviceIds["Digital Marketing"],
      pricingType: PricingType.PLATFORM_BASED,
      platform: Platform.LINKEDIN,
      subtitle: "per user/month, billed annually",
      targetAudience: "For Sales Teams",
      buttonText: "Get Started",
    },
    {
      name: "Enterprise",
      price: "149",
      period: "monthly",
      features: [
        "Multi-account management",
        "API integrations",
        "Custom training",
        "Dedicated support",
        "Advanced analytics",
      ],
      highlight: false,
      order: 4,
      serviceId: serviceIds["Digital Marketing"],
      pricingType: PricingType.PLATFORM_BASED,
      platform: Platform.LINKEDIN,
      subtitle: "per user/month, billed annually",
      targetAudience: "For Enterprise",
      buttonText: "Contact Sales",
    },

    // TikTok Plans
    {
      name: "Free",
      price: "0",
      period: "monthly",
      features: [
        "TikTok account setup",
        "Content ideas",
        "Basic hashtag research",
        "Up to 5 videos per month",
      ],
      highlight: false,
      order: 1,
      serviceId: serviceIds["Digital Marketing"],
      pricingType: PricingType.PLATFORM_BASED,
      platform: Platform.TIKTOK,
      subtitle: "per user/month, billed annually",
      targetAudience: "For Creators",
      buttonText: "Get Started",
    },
    {
      name: "Basic",
      price: "29",
      discount: "15",
      period: "monthly",
      features: [
        "TikTok ads management",
        "Trend analysis",
        "Content creation",
        "Performance tracking",
        "Up to 20 videos per month",
      ],
      highlight: false,
      order: 2,
      serviceId: serviceIds["Digital Marketing"],
      pricingType: PricingType.PLATFORM_BASED,
      platform: Platform.TIKTOK,
      subtitle: "per user/month, billed annually",
      targetAudience: "For Small Brands",
      buttonText: "Get Started",
    },
    {
      name: "Pro",
      price: "49",
      discount: "15",
      period: "monthly",
      features: [
        "Advanced TikTok campaigns",
        "Influencer partnerships",
        "Viral content strategy",
        "Analytics insights",
        "Unlimited videos",
      ],
      highlight: true,
      order: 3,
      serviceId: serviceIds["Digital Marketing"],
      pricingType: PricingType.PLATFORM_BASED,
      platform: Platform.TIKTOK,
      subtitle: "per user/month, billed annually",
      targetAudience: "For Growing Brands",
      buttonText: "Get Started",
    },
    {
      name: "Enterprise",
      price: "99",
      period: "monthly",
      features: [
        "Multi-brand management",
        "Custom creative production",
        "Advanced targeting",
        "Priority support",
        "White-label solutions",
      ],
      highlight: false,
      order: 4,
      serviceId: serviceIds["Digital Marketing"],
      pricingType: PricingType.PLATFORM_BASED,
      platform: Platform.TIKTOK,
      subtitle: "per user/month, billed annually",
      targetAudience: "For Agencies",
      buttonText: "Contact Sales",
    },

    // ===== GRAPHICS DESIGN (Simple pricing) =====
    {
      name: "Free",
      price: "0",
      period: "project",
      features: [
        "Basic logo design",
        "Simple business card",
        "1 revision",
        "Standard file formats",
      ],
      highlight: false,
      order: 1,
      serviceId: serviceIds["Graphics Design"],
      pricingType: PricingType.SIMPLE,
      platform: Platform.GENERAL,
      subtitle: "per project",
      targetAudience: "For Startups",
      buttonText: "Get Started",
    },
    {
      name: "Basic",
      price: "299",
      period: "project",
      features: [
        "Custom logo design",
        "Business card design",
        "Letterhead design",
        "3 revisions",
        "All file formats",
      ],
      highlight: false,
      order: 2,
      serviceId: serviceIds["Graphics Design"],
      pricingType: PricingType.SIMPLE,
      platform: Platform.GENERAL,
      subtitle: "per project",
      targetAudience: "For Small Businesses",
      buttonText: "Get Started",
    },
    {
      name: "Pro",
      price: "599",
      discount: "10",
      period: "project",
      features: [
        "Complete brand identity",
        "Social media graphics",
        "Marketing materials",
        "5 revisions",
        "Source files included",
      ],
      highlight: true,
      order: 3,
      serviceId: serviceIds["Graphics Design"],
      pricingType: PricingType.SIMPLE,
      platform: Platform.GENERAL,
      subtitle: "per project",
      targetAudience: "For Growing Businesses",
      buttonText: "Get Started",
    },
    {
      name: "Enterprise",
      price: "1299",
      period: "project",
      features: [
        "Full brand package",
        "Print & digital assets",
        "Brand guidelines",
        "Unlimited revisions",
        "Priority support",
      ],
      highlight: false,
      order: 4,
      serviceId: serviceIds["Graphics Design"],
      pricingType: PricingType.SIMPLE,
      platform: Platform.GENERAL,
      subtitle: "per project",
      targetAudience: "For Large Companies",
      buttonText: "Contact Sales",
    },

    // ===== APP DEVELOPMENT (Simple pricing) =====
    {
      name: "Free",
      price: "0",
      period: "monthly",
      features: [
        "Basic app consultation",
        "Simple wireframes",
        "Basic documentation",
        "1 hour consultation",
      ],
      highlight: false,
      order: 1,
      serviceId: serviceIds["App Development"],
      pricingType: PricingType.SIMPLE,
      platform: Platform.GENERAL,
      subtitle: "consultation only",
      targetAudience: "For Ideas",
      buttonText: "Get Started",
    },
    {
      name: "Basic",
      price: "2999",
      period: "project",
      features: [
        "Simple mobile app",
        "Basic UI/UX design",
        "Core functionality",
        "3 months support",
      ],
      highlight: false,
      order: 2,
      serviceId: serviceIds["App Development"],
      pricingType: PricingType.SIMPLE,
      platform: Platform.GENERAL,
      subtitle: "per project",
      targetAudience: "For Startups",
      buttonText: "Get Started",
    },
    {
      name: "Pro",
      price: "7999",
      discount: "15",
      period: "project",
      features: [
        "Advanced mobile app",
        "Custom UI/UX design",
        "Backend integration",
        "6 months support",
        "App store submission",
      ],
      highlight: true,
      order: 3,
      serviceId: serviceIds["App Development"],
      pricingType: PricingType.SIMPLE,
      platform: Platform.GENERAL,
      subtitle: "per project",
      targetAudience: "For Growing Businesses",
      buttonText: "Get Started",
    },
    {
      name: "Enterprise",
      price: "19999",
      period: "project",
      features: [
        "Complex mobile app",
        "Multi-platform support",
        "Advanced features",
        "12 months support",
        "Dedicated team",
      ],
      highlight: false,
      order: 4,
      serviceId: serviceIds["App Development"],
      pricingType: PricingType.SIMPLE,
      platform: Platform.GENERAL,
      subtitle: "per project",
      targetAudience: "For Large Companies",
      buttonText: "Contact Sales",
    },

    // ===== UI/UX DESIGN (Simple pricing) =====
    {
      name: "Free",
      price: "0",
      period: "project",
      features: [
        "Basic wireframes",
        "Simple mockups",
        "1 revision",
        "Basic documentation",
      ],
      highlight: false,
      order: 1,
      serviceId: serviceIds["UI/UX Design"],
      pricingType: PricingType.SIMPLE,
      platform: Platform.GENERAL,
      subtitle: "per project",
      targetAudience: "For Prototypes",
      buttonText: "Get Started",
    },
    {
      name: "Basic",
      price: "1999",
      period: "project",
      features: [
        "Complete UI design",
        "User flow design",
        "3 revisions",
        "Design system",
      ],
      highlight: false,
      order: 2,
      serviceId: serviceIds["UI/UX Design"],
      pricingType: PricingType.SIMPLE,
      platform: Platform.GENERAL,
      subtitle: "per project",
      targetAudience: "For Small Projects",
      buttonText: "Get Started",
    },
    {
      name: "Pro",
      price: "4999",
      discount: "10",
      period: "project",
      features: [
        "Advanced UI/UX design",
        "User research",
        "Prototyping",
        "5 revisions",
        "Usability testing",
      ],
      highlight: true,
      order: 3,
      serviceId: serviceIds["UI/UX Design"],
      pricingType: PricingType.SIMPLE,
      platform: Platform.GENERAL,
      subtitle: "per project",
      targetAudience: "For Growing Businesses",
      buttonText: "Get Started",
    },
    {
      name: "Enterprise",
      price: "9999",
      period: "project",
      features: [
        "Complex UI/UX design",
        "Advanced user research",
        "Multiple platforms",
        "Unlimited revisions",
        "Dedicated designer",
      ],
      highlight: false,
      order: 4,
      serviceId: serviceIds["UI/UX Design"],
      pricingType: PricingType.SIMPLE,
      platform: Platform.GENERAL,
      subtitle: "per project",
      targetAudience: "For Large Companies",
      buttonText: "Contact Sales",
    },

    // ===== WEBSITE DEVELOPMENT (Simple pricing) =====
    {
      name: "Free",
      price: "0",
      period: "project",
      features: [
        "Basic website template",
        "Contact form",
        "Mobile responsive",
        "Basic SEO",
      ],
      highlight: false,
      order: 1,
      serviceId: serviceIds["Website Development"],
      pricingType: PricingType.SIMPLE,
      platform: Platform.GENERAL,
      subtitle: "per project",
      targetAudience: "For Small Projects",
      buttonText: "Get Started",
    },
    {
      name: "Basic",
      price: "1999",
      period: "project",
      features: [
        "Custom design",
        "CMS integration",
        "SEO optimization",
        "Analytics setup",
        "3 months support",
      ],
      highlight: false,
      order: 2,
      serviceId: serviceIds["Website Development"],
      pricingType: PricingType.SIMPLE,
      platform: Platform.GENERAL,
      subtitle: "per project",
      targetAudience: "For Small Businesses",
      buttonText: "Get Started",
    },
    {
      name: "Pro",
      price: "4999",
      discount: "15",
      period: "project",
      features: [
        "Advanced features",
        "E-commerce integration",
        "Performance optimization",
        "Priority support",
        "6 months support",
      ],
      highlight: true,
      order: 3,
      serviceId: serviceIds["Website Development"],
      pricingType: PricingType.SIMPLE,
      platform: Platform.GENERAL,
      subtitle: "per project",
      targetAudience: "For Growing Businesses",
      buttonText: "Get Started",
    },
    {
      name: "Enterprise",
      price: "9999",
      period: "project",
      features: [
        "Custom development",
        "API integrations",
        "Advanced security",
        "Dedicated support",
        "12 months support",
      ],
      highlight: false,
      order: 4,
      serviceId: serviceIds["Website Development"],
      pricingType: PricingType.SIMPLE,
      platform: Platform.GENERAL,
      subtitle: "per project",
      targetAudience: "For Large Corporations",
      buttonText: "Contact Sales",
    },

    // ===== SOCIAL MEDIA MANAGEMENT (Platform-based pricing) =====
    // Instagram Plans
    {
      name: "Free",
      price: "0",
      period: "monthly",
      features: [
        "Basic Instagram setup",
        "Content calendar",
        "Basic hashtag research",
        "Up to 10 posts per month",
      ],
      highlight: false,
      order: 1,
      serviceId: serviceIds["Social Media Management"],
      pricingType: PricingType.PLATFORM_BASED,
      platform: Platform.INSTAGRAM,
      subtitle: "per user/month, billed annually",
      targetAudience: "For Personal Brands",
      buttonText: "Get Started",
    },
    {
      name: "Basic",
      price: "199",
      discount: "10",
      period: "monthly",
      features: [
        "Instagram content creation",
        "Story management",
        "Hashtag strategy",
        "Basic analytics",
        "Up to 30 posts per month",
      ],
      highlight: false,
      order: 2,
      serviceId: serviceIds["Social Media Management"],
      pricingType: PricingType.PLATFORM_BASED,
      platform: Platform.INSTAGRAM,
      subtitle: "per user/month, billed annually",
      targetAudience: "For Small Businesses",
      buttonText: "Get Started",
    },
    {
      name: "Pro",
      price: "399",
      discount: "10",
      period: "monthly",
      features: [
        "Advanced Instagram strategy",
        "Influencer outreach",
        "Advanced analytics",
        "Priority support",
        "Unlimited posts",
      ],
      highlight: true,
      order: 3,
      serviceId: serviceIds["Social Media Management"],
      pricingType: PricingType.PLATFORM_BASED,
      platform: Platform.INSTAGRAM,
      subtitle: "per user/month, billed annually",
      targetAudience: "For Growing Brands",
      buttonText: "Get Started",
    },
    {
      name: "Enterprise",
      price: "799",
      period: "monthly",
      features: [
        "Multi-account management",
        "Custom campaigns",
        "Advanced reporting",
        "Dedicated manager",
        "White-label solutions",
      ],
      highlight: false,
      order: 4,
      serviceId: serviceIds["Social Media Management"],
      pricingType: PricingType.PLATFORM_BASED,
      platform: Platform.INSTAGRAM,
      subtitle: "per user/month, billed annually",
      targetAudience: "For Agencies",
      buttonText: "Contact Sales",
    },

    // Twitter Plans
    {
      name: "Free",
      price: "0",
      period: "monthly",
      features: [
        "Basic Twitter setup",
        "Content calendar",
        "Basic engagement",
        "Up to 20 tweets per month",
      ],
      highlight: false,
      order: 1,
      serviceId: serviceIds["Social Media Management"],
      pricingType: PricingType.PLATFORM_BASED,
      platform: Platform.TWITTER,
      subtitle: "per user/month, billed annually",
      targetAudience: "For Personal Brands",
      buttonText: "Get Started",
    },
    {
      name: "Basic",
      price: "149",
      discount: "10",
      period: "monthly",
      features: [
        "Twitter content creation",
        "Engagement management",
        "Trend monitoring",
        "Basic analytics",
        "Up to 50 tweets per month",
      ],
      highlight: false,
      order: 2,
      serviceId: serviceIds["Social Media Management"],
      pricingType: PricingType.PLATFORM_BASED,
      platform: Platform.TWITTER,
      subtitle: "per user/month, billed annually",
      targetAudience: "For Small Businesses",
      buttonText: "Get Started",
    },
    {
      name: "Pro",
      price: "299",
      discount: "10",
      period: "monthly",
      features: [
        "Advanced Twitter strategy",
        "Community management",
        "Advanced analytics",
        "Priority support",
        "Unlimited tweets",
      ],
      highlight: true,
      order: 3,
      serviceId: serviceIds["Social Media Management"],
      pricingType: PricingType.PLATFORM_BASED,
      platform: Platform.TWITTER,
      subtitle: "per user/month, billed annually",
      targetAudience: "For Growing Brands",
      buttonText: "Get Started",
    },
    {
      name: "Enterprise",
      price: "599",
      period: "monthly",
      features: [
        "Multi-account management",
        "Custom campaigns",
        "Advanced reporting",
        "Dedicated manager",
        "White-label solutions",
      ],
      highlight: false,
      order: 4,
      serviceId: serviceIds["Social Media Management"],
      pricingType: PricingType.PLATFORM_BASED,
      platform: Platform.TWITTER,
      subtitle: "per user/month, billed annually",
      targetAudience: "For Agencies",
      buttonText: "Contact Sales",
    },

    // ===== OUTSOURCING (Simple pricing) =====
    {
      name: "Free",
      price: "0",
      period: "monthly",
      features: [
        "Basic consultation",
        "Project assessment",
        "Basic recommendations",
        "1 hour consultation",
      ],
      highlight: false,
      order: 1,
      serviceId: serviceIds["Outsourcing"],
      pricingType: PricingType.SIMPLE,
      platform: Platform.GENERAL,
      subtitle: "consultation only",
      targetAudience: "For Assessment",
      buttonText: "Get Started",
    },
    {
      name: "Basic",
      price: "1999",
      period: "monthly",
      features: [
        "Dedicated developer",
        "40 hours per month",
        "Basic project management",
        "Email support",
      ],
      highlight: false,
      order: 2,
      serviceId: serviceIds["Outsourcing"],
      pricingType: PricingType.SIMPLE,
      platform: Platform.GENERAL,
      subtitle: "per month",
      targetAudience: "For Small Projects",
      buttonText: "Get Started",
    },
    {
      name: "Pro",
      price: "3999",
      discount: "15",
      period: "monthly",
      features: [
        "Senior developer team",
        "80 hours per month",
        "Advanced project management",
        "Priority support",
        "Weekly reports",
      ],
      highlight: true,
      order: 3,
      serviceId: serviceIds["Outsourcing"],
      pricingType: PricingType.SIMPLE,
      platform: Platform.GENERAL,
      subtitle: "per month",
      targetAudience: "For Growing Businesses",
      buttonText: "Get Started",
    },
    {
      name: "Enterprise",
      price: "7999",
      period: "monthly",
      features: [
        "Full development team",
        "160 hours per month",
        "Dedicated project manager",
        "24/7 support",
        "Custom solutions",
      ],
      highlight: false,
      order: 4,
      serviceId: serviceIds["Outsourcing"],
      pricingType: PricingType.SIMPLE,
      platform: Platform.GENERAL,
      subtitle: "per month",
      targetAudience: "For Large Companies",
      buttonText: "Contact Sales",
    },
  ];

  // Save all plans
  await pricingRepository.save(allPricingPlans);
}

async function seed() {
  const dataSource = await getDataSource();

  try {

    // Create admin user
    const adminPassword = process.env.ADMIN_PASSWORD || "changeme123";
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const adminUser = new User();
    adminUser.email = process.env.ADMIN_EMAIL || "admin@bekur.com";
    adminUser.passwordHash = hashedPassword;
    adminUser.role = UserRole.ADMIN;

    await dataSource.getRepository(User).save(adminUser);

    // Seed site settings
    const siteSettings = [
      {
        key: "contact_info",
        value: {
          email: "info@bekurtechnologies.com",
          phone: "+251-922-876-643 / +251-711-282-830",
          linkedin: "https://www.linkedin.com/company/bekur-technologies/",
          officeLocation: "Sebara Babur,Piassa, Addis Abeba, Ethiopia",
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
      {
        key: "about_section_header",
        value: {
          title: "About us",
          description: "Our Vision & mission",
        },
      },
      {
        key: "footer_cta",
        value: {
          line1: "LET'S ",
          line2: "COLLAB ",
          line3: "TODAY.",
          line4: "AND ",
          line5: "BUILD ",
          line6: "YOUR EXPECTATIONS.",
          buttonText: "Book A Call",
          buttonLink:
            "https://calendar.google.com/calendar/u/0/r/eventedit?text=Meeting+with+Bekur+Technologies&details=Discuss+project+requirements&add=bekurtechsolution@gmail.com",
        },
      },
      {
        key: "footer_company_name",
        value: "Bekur Technologies",
      },
      {
        key: "footer_terms_link",
        value: "#",
      },
      {
        key: "footer_privacy_link",
        value: "#",
      },
      {
        key: "contact_page_title",
        value: "We're Here to Help — Reach out with any questions or ideas.",
      },
      {
        key: "services_page_title",
        value: "Our Services",
      },
    ];

    for (const setting of siteSettings) {
      const siteSetting = new SiteSetting();
      siteSetting.key = setting.key;
      siteSetting.value =
        typeof setting.value === "string"
          ? { value: setting.value }
          : (setting.value as Record<string, unknown>);
      await dataSource.getRepository(SiteSetting).save(siteSetting);
    }

    // Seed hero section
    const heroSection = new HeroSection();
    heroSection.headline = heroData.hero.headline;
    heroSection.description = heroData.hero.description;
    heroSection.video = heroData.hero.video;
    heroSection.clientSatisfaction = heroData.hero.clientSatisfaction;
    heroSection.socialPlatforms = heroData.hero.socialPlatforms;
    heroSection.background = heroData.hero.background;

    await dataSource.getRepository(HeroSection).save(heroSection);

    // Seed features
    for (let i = 0; i < featuresData.features.length; i++) {
      const featureData = featuresData.features[i];
      const feature = new Feature();
      feature.title = featureData.title;
      feature.description = featureData.description;
      feature.order = i;
      await dataSource.getRepository(Feature).save(feature);
    }

    // Seed services
    for (let i = 0; i < servicesData.services.length; i++) {
      const serviceData = servicesData.services[i];
      const service = new Service();
      service.number = serviceData.number;
      service.title = serviceData.title;
      service.description = serviceData.description;
      service.iconKey = serviceData.iconKey;
      service.order = i;
      await dataSource.getRepository(Service).save(service);
    }

    // Seed pricing plans
    await seedPricingPlans(dataSource);

    // Statistics seeding removed - entity not found

    // Seed team members
    for (let i = 0; i < teamData.teamMembers.length; i++) {
      const memberData = teamData.teamMembers[i];
      const member = new TeamMember();
      member.profileImage = memberData.profileImage || "";
      member.name = memberData.name;
      member.title = memberData.title;
      member.socialLinks = memberData.socialLinks;
      member.order = i;
      await dataSource.getRepository(TeamMember).save(member);
    }

    // Seed testimonials
    for (let i = 0; i < testimonialsData.testimonials.length; i++) {
      const testimonialData = testimonialsData.testimonials[i];
      const testimonial = new Testimonial();
      testimonial.username = testimonialData.username;
      testimonial.description = testimonialData.description;
      testimonial.joinedDate = testimonialData.joinedDate;
      testimonial.order = i;
      await dataSource.getRepository(Testimonial).save(testimonial);
    }

    // Seed companies
    for (let i = 0; i < companiesData.companies.length; i++) {
      const companyData = companiesData.companies[i];
      const company = new Company();
      company.name = companyData.name;
      company.order = i;
      await dataSource.getRepository(Company).save(company);
    }

    // Seed values
    for (let i = 0; i < valuesData.values.length; i++) {
      const valueData = valuesData.values[i];
      const value = new Value();
      value.title = valueData.title;
      value.description = valueData.description;
      value.step = valueData.step;
      value.iconKey = valueData.iconKey;
      value.order = i;
      await dataSource.getRepository(Value).save(value);
    }

    // Work highlights seeding removed - entity not found

    // Service steps seeding removed - entity not found

    // Outsource roles seeding removed - entity not found

    // Seed contact information
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

    for (const contactInfo of contactData) {
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
      await dataSource.getRepository(Contact).save(contact);
    }

    // Seed blog posts
    for (let i = 0; i < blogsData.homePageBlogs.length; i++) {
      const blogData = blogsData.homePageBlogs[i];
      const blog = new BlogPost();
      blog.slug = `blog-${blogData.id}`;
      blog.title = blogData.headline;
      blog.excerpt = blogData.subtitle;
      blog.content = { content: blogData.subtitle }; // Simple content structure
      blog.html = `<p>${blogData.subtitle}</p>`;
      blog.featuredImage = blogData.blogUrl;
      blog.tags = [blogData.tag];
      blog.isPublished = true;
      blog.publishedAt = new Date();
      await dataSource.getRepository(BlogPost).save(blog);
    }

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await dataSource.destroy();
  }
}

seed().catch(console.error);
