import servicesData from "./services.json";
import testimonialsData from "./testimonials.json";
import teamData from "./team.json";
import contactData from "./contact.json";
import pricingData from "./pricing.json";
import { PricingType } from "@/types/client";

export interface StaticService {
  id: number;
  number: string;
  title: string;
  description: string;
  iconKey: string;
  slug: string;
  order: number;
}

export interface StaticTestimonial {
  id: number;
  profileImage: string;
  username: string;
  description: string;
  joinedDate: string;
  order: number;
}

export interface StaticTeamMember {
  id: number;
  profileImage: string;
  name: string;
  title: string;
  socialLinks: {
    facebook?: string;
    linkedin?: string;
    github?: string;
    email?: string;
  };
}

export interface StaticContactInfo {
  id: number;
  title: string;
  description: string;
  iconType: "email" | "phone" | "linkedin" | "location";
  isLink: boolean;
  href?: string;
  order: number;
}

const toSlug = (value: string): string =>
  value
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

export const getServices = (): StaticService[] =>
  servicesData.services.map((service, index) => ({
    id: index + 1,
    number: service.number,
    title: service.title,
    description: service.description,
    iconKey: service.iconKey,
    slug: toSlug(service.title),
    order: index,
  }));

export const getTestimonials = (): StaticTestimonial[] =>
  testimonialsData.testimonials.map((testimonial, index) => ({
    ...testimonial,
    order: index,
  }));

export const getTeamMembers = (): StaticTeamMember[] =>
  teamData.teamMembers as StaticTeamMember[];

export const getContactInfo = (): StaticContactInfo[] =>
  [...contactData.contactInfo].sort((a, b) => a.order - b.order) as StaticContactInfo[];

export interface StaticPricingPlan {
  name: string;
  price: string;
  period: string;
  features: string[];
  highlight: boolean;
  order: number;
  subtitle?: string;
  discount?: string;
  targetAudience?: string;
  buttonText?: string;
  originalPrice?: string;
}

export interface StaticPricingResponse {
  pricingType: PricingType;
  plans?: StaticPricingPlan[];
  platforms?: Record<string, StaticPricingPlan[]>;
}

type PricingCatalog = Record<
  string,
  {
    pricingType: string;
    plans?: StaticPricingPlan[];
    platforms?: Record<string, StaticPricingPlan[]>;
  }
>;

const pricingAliases: Record<string, string> = {
  webdevelopment: "websitedevelopment",
  uiux: "uiuxdesign",
  outsource: "outsourcing",
};

const normalizePricingKey = (serviceName: string): string => {
  const normalized = serviceName.toLowerCase().replace(/[^a-z0-9]/g, "");
  return pricingAliases[normalized] ?? normalized;
};

export const getPricingByServiceName = (
  serviceName: string
): StaticPricingResponse | null => {
  const catalog = pricingData as PricingCatalog;
  const entry = catalog[normalizePricingKey(serviceName)];

  if (!entry) {
    return null;
  }

  return {
    pricingType:
      entry.pricingType === PricingType.PLATFORM_BASED
        ? PricingType.PLATFORM_BASED
        : PricingType.SIMPLE,
    plans: entry.plans,
    platforms: entry.platforms,
  };
};
