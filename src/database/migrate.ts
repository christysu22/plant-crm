import { db, migrateDatabase } from './db';

console.log('Running database migrations...');
migrateDatabase(db);
console.log('Migrations complete!');
db.close();
