import { NextRequest, NextResponse } from 'next/server';
import { CustomerModel } from '@/models/Customer';
import { CustomerFilter } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filter: CustomerFilter = {
      platform: searchParams.get('platform') as any || undefined,
      is_seller: searchParams.get('is_seller') ? searchParams.get('is_seller') === 'true' : undefined,
      min_orders: searchParams.get('min_orders') ? parseInt(searchParams.get('min_orders')!) : undefined,
      tag: searchParams.get('tag') || undefined,
      search: searchParams.get('search') || undefined,
    };

    const customers = CustomerModel.findAll(filter);
    return NextResponse.json(customers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = CustomerModel.create(body);
    const customer = CustomerModel.findById(id);
    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 400 });
  }
}
