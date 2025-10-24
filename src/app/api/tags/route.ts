import { NextRequest, NextResponse } from 'next/server';
import { CustomerTagModel } from '@/models/CustomerTag';

export async function GET(request: NextRequest) {
  try {
    const tags = CustomerTagModel.getAllTags();
    return NextResponse.json(tags);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}
