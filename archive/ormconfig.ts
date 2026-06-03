import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env
config({ path: resolve(process.cwd(), ".env") });

import { DataSource } from "typeorm";

const dataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [
    "src/lib/entities/User.ts",
    "src/lib/entities/HeroSection.ts",
    "src/lib/entities/Feature.ts",
    "src/lib/entities/Service.ts",
    "src/lib/entities/TeamMember.ts",
    "src/lib/entities/Testimonial.ts",
    "src/lib/entities/Company.ts",
    "src/lib/entities/Value.ts",
    "src/lib/entities/PricingPlan.ts",
    "src/lib/entities/BlogPost.ts",
    "src/lib/entities/PortfolioProject.ts",
    "src/lib/entities/Media.ts",
    "src/lib/entities/Contact.ts",
    "src/lib/entities/Tag.ts"
  ],
  synchronize: false,
  logging: true,
  migrations: ["src/db/migrations/**/*.ts", "src/db/migrations/**/*.js"],
  subscribers: ["src/subscriber/**/*.ts", "src/subscriber/**/*.js"],
  // Disable migrations for now since we're using synchronize in development
  // migrations: ["src/db/migrations/*.ts"],
  // migrationsRun: false,
});

export default dataSource;
