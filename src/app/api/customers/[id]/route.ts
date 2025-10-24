import { NextRequest, NextResponse } from 'next/server';
import { CustomerModel } from '@/models/Customer';
import { OrderModel } from '@/models/Order';
import { CustomerNoteModel } from '@/models/CustomerNote';
import { CustomerTagModel } from '@/models/CustomerTag';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const customer = CustomerModel.findById(id);

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const orders = OrderModel.findByCustomerId(id);
    const notes = CustomerNoteModel.findByCustomerId(id);
    const tags = CustomerTagModel.findByCustomerId(id);

    return NextResponse.json({
      ...customer,
      orders,
      notes,
      tags,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch customer' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const success = CustomerModel.update(id, body);

    if (!success) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const customer = CustomerModel.findById(id);
    return NextResponse.json(customer);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const success = CustomerModel.delete(id);

    if (!success) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 });
  }
}
