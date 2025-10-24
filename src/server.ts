import express from 'express';
import cors from 'cors';
import { join } from 'path';
import { migrateDatabase, db } from './database/db';
import customersRouter from './routes/customers';
import ordersRouter from './routes/orders';
import tagsRouter from './routes/tags';
import { mkdirSync, existsSync } from 'fs';

// Initialize database
const dataDir = join(__dirname, '../data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}
migrateDatabase(db);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (frontend)
app.use(express.static(join(__dirname, '../public')));

// API Routes
app.use('/api/customers', customersRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/tags', tagsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Plant CRM API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Plant CRM Server running on http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
