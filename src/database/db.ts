import Database from 'better-sqlite3';
import { readFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const DB_PATH = join(process.cwd(), 'data', 'plant-crm.db');

export function initDatabase(): Database.Database {
  // Ensure data directory exists
  const dataDir = join(process.cwd(), 'data');
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }

  const db = new Database(DB_PATH);

  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  return db;
}

export function migrateDatabase(db: Database.Database): void {
  const schema = readFileSync(join(process.cwd(), 'src', 'database', 'schema.sql'), 'utf-8');
  db.exec(schema);
  console.log('Database schema initialized successfully');
}

export const db = initDatabase();
