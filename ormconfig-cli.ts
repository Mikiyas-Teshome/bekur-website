import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env
config({ path: resolve(process.cwd(), ".env") });

import { DataSource } from "typeorm";

const dataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [
    "src/lib/entities/*.ts"
  ],
  synchronize: false,
  logging: true,
  migrations: ["src/db/migrations/**/*.ts", "src/db/migrations/**/*.js"],
  subscribers: ["src/subscriber/**/*.ts", "src/subscriber/**/*.js"],
});

export default dataSource;
