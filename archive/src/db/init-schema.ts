import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { getDataSource } from '../lib/db';

async function initSchema() {
  try {
    const dataSource = await getDataSource();
    
    // This will create all tables if they don't exist
    
    // Close the connection
    await dataSource.destroy();
  } catch (error) {
    console.error('Error initializing schema:', error);
    process.exit(1);
  }
}

// Run the init function
initSchema();
