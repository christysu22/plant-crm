import { NextRequest, NextResponse } from 'next/server';
import { CustomerTagModel } from '@/models/CustomerTag';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const { tag } = await request.json();

    if (!tag) {
      return NextResponse.json({ error: 'Tag is required' }, { status: 400 });
    }

    CustomerTagModel.addTag(id, tag);
    const tags = CustomerTagModel.findByCustomerId(id);
    return NextResponse.json(tags);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add tag' }, { status: 400 });
  }
}
