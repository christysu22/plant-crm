import { migrateDatabase, db } from '@/database/db';
import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';

let initialized = false;

export function initializeDatabase() {
  if (initialized) return;

  try {
    // Create data directory if it doesn't exist
    const dataDir = join(process.cwd(), 'data');
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true });
    }

    // Run migrations
    migrateDatabase(db);
    initialized = true;
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}
