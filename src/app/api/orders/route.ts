import { NextRequest, NextResponse } from 'next/server';
import { OrderModel } from '@/models/Order';

export async function GET(request: NextRequest) {
  try {
    const orders = OrderModel.findAll();
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = OrderModel.create(body);
    const order = OrderModel.findById(id);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 400 });
  }
}
