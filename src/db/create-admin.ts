import "reflect-metadata";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables
config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), ".env.local") });

import { getDataSource } from "../lib/db";
import { User, UserRole } from "../lib/entities/User";
import bcrypt from "bcryptjs";

async function createAdmin() {
  const dataSource = await getDataSource();

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
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    throw error;
  } finally {
    await dataSource.destroy();
  }
}

createAdmin().catch(console.error);
