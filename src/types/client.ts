// Client-side types for pricing plans (without TypeORM decorators)
export enum PricingType {
  SIMPLE = "simple",
  PLATFORM_BASED = "platform_based",
}

export enum Platform {
  FACEBOOK = "facebook",
  LINKEDIN = "linkedin",
  TIKTOK = "tiktok",
  INSTAGRAM = "instagram",
  TWITTER = "twitter",
  YOUTUBE = "youtube",
  GOOGLE = "google",
  GENERAL = "general",
}

export interface PricingPlan {
  id: number;
  name: string;
  price: string;
  period: string;
  features: string[];
  highlight: boolean;
  order: number;
  serviceId?: number;
  originalPrice?: string;
  discount?: string;
  targetAudience?: string;
  buttonText?: string;
  pricingType: PricingType;
  platform?: Platform;
  subtitle?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: number;
  number: string;
  title: string;
  description: string;
  iconKey: string;
  order: number;
  slug: string;
  steps?: Record<string, unknown>[];
  createdAt: Date;
  updatedAt: Date;
}
