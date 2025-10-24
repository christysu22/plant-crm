import { NextRequest, NextResponse } from 'next/server';
import { CustomerNoteModel } from '@/models/CustomerNote';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();

    const note = {
      customer_id: id,
      note_type: body.note_type,
      content: body.content,
    };

    CustomerNoteModel.create(note);
    const notes = CustomerNoteModel.findByCustomerId(id);
    return NextResponse.json(notes, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add note' }, { status: 400 });
  }
}
