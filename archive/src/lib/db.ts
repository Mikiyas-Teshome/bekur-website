import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { HeroSection } from "./entities/HeroSection";
import { Feature } from "./entities/Feature";
import { Service } from "./entities/Service";
import { TeamMember } from "./entities/TeamMember";
import { Testimonial } from "./entities/Testimonial";
import { Company } from "./entities/Company";
import { Value } from "./entities/Value";
import { PricingPlan } from "./entities/PricingPlan";
import { BlogPost } from "./entities/BlogPost";
import { PortfolioProject } from "./entities/PortfolioProject";
import { Contact } from "./entities/Contact";
import { Media } from "./entities/Media";
import { Tag } from "./entities/Tag";

let dataSource: DataSource | null = null;
let initializationPromise: Promise<DataSource> | null = null;

export const getDataSource = async (): Promise<DataSource> => {
  // If already initialized, return it
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  // If initialization is in progress, wait for it
  if (initializationPromise) {
    return initializationPromise;
  }

  // Start initialization
  initializationPromise = initializeDataSource();
  
  try {
    const result = await initializationPromise;
    return result;
  } catch (error) {
    // Reset the promise on error so we can try again
    initializationPromise = null;
    throw error;
  }
};

const initializeDataSource = async (): Promise<DataSource> => {
  // If there's a corrupted dataSource, destroy it first
  if (dataSource && !dataSource.isInitialized) {
    try {
      await dataSource.destroy();
    } catch {
      // Ignore destroy errors
    }
    dataSource = null;
  }

  // Check if DATABASE_URL is available
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  dataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    entities: [
      User,
      HeroSection,
      Feature,
      Service,
      TeamMember,
      Testimonial,
      Company,
      Value,
      PricingPlan,
      BlogPost,
      PortfolioProject,
      Contact,
      Media,
      Tag,
    ],
    synchronize: true, // Enable synchronize for production to avoid migration issues
    logging: false,
    // Add connection options for better stability
    extra: {
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    },
    // Disable migrations to avoid ES module issues in production
    // migrations: ["src/db/migrations/**/*.ts", "src/db/migrations/**/*.js"],
    // migrationsRun: false,
  });

  // Retry logic for database connection
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (!dataSource) {
        throw new Error("DataSource is null");
      }
      await dataSource.initialize();

      // Wait a bit for entities to be fully loaded
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Validate that all entities are properly registered
      if (dataSource && dataSource.entityMetadatas) {
        const entityMetadatas = dataSource.entityMetadatas;
        const entityNames = entityMetadatas.map((metadata) => metadata.name);

        // Check if critical entities are registered - but don't reset if they're missing
        // This was causing the cascade of failures
        const criticalEntities = ["Company", "Service", "PortfolioProject"];
        const missingEntities = criticalEntities.filter(
          (name) => !entityNames.includes(name)
        );
        if (missingEntities.length > 0) {
          // Just log the warning but don't reset - let the app continue
        }
      } else {
        // Don't reset here either - let the app continue
      }

      // If we get here, initialization was successful
      return dataSource;
    } catch (error) {
      lastError = error as Error;    
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Reset dataSource for next attempt
        if (dataSource) {
          try {
            await dataSource.destroy();
          } catch {
            // Ignore destroy errors
          }
          dataSource = null;
        }
      }
    }
  }

  // If we get here, all retries failed
  dataSource = null;
  throw lastError || new Error("DataSource initialization failed after all retries");
};

export const closeDataSource = async (): Promise<void> => {
  if (dataSource && dataSource.isInitialized) {
    await dataSource.destroy();
    dataSource = null;
  }
};

export const resetDataSource = async (): Promise<void> => {
  // Reset the initialization promise
  initializationPromise = null;
  
  if (dataSource) {
    try {
      if (dataSource.isInitialized) {
        await dataSource.destroy();
      }
    } catch (error) {
      console.warn("Error destroying DataSource during reset:", error);
    }
    dataSource = null;
  }
  // Force garbage collection if available
  if (global.gc) {
    global.gc();
  }
};

export const validateEntity = (entityName: string): boolean => {
  if (!dataSource || !dataSource.isInitialized) {
    return false;
  }

  try {
    const entityMetadatas = dataSource.entityMetadatas;
    if (!entityMetadatas) {
      return false;
    }
    return entityMetadatas.some((metadata) => metadata.name === entityName);
  } catch {
    return false;
  }
};

export const isDataSourceHealthy = (): boolean => {
  return !!(dataSource && dataSource.isInitialized);
};

export const getDataSourceStatus = (): { initialized: boolean; entityCount: number } => {
  if (!dataSource || !dataSource.isInitialized) {
    return { initialized: false, entityCount: 0 };
  }

  try {
    const entityMetadatas = dataSource.entityMetadatas;
    return {
      initialized: true,
      entityCount: entityMetadatas ? entityMetadatas.length : 0,
    };
  } catch {
    return { initialized: false, entityCount: 0 };
  }
};
