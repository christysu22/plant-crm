import { NextRequest, NextResponse } from 'next/server';
import { CustomerTagModel } from '@/models/CustomerTag';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; tag: string } }
) {
  try {
    const id = parseInt(params.id);
    const tag = params.tag;

    const success = CustomerTagModel.removeTag(id, tag);

    if (!success) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to remove tag' }, { status: 500 });
  }
}
