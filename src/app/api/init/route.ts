import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db-init';

export async function GET() {
  try {
    initializeDatabase();
    return NextResponse.json({ message: 'Database initialized successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to initialize database' }, { status: 500 });
  }
}
