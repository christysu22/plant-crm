import { db } from '../database/db';
import { Order } from '../types';
import { CustomerModel } from './Customer';

export class OrderModel {
  static create(order: Omit<Order, 'id' | 'created_at'>): number {
    const stmt = db.prepare(`
      INSERT INTO orders (customer_id, order_number, platform, order_date, items, total_amount, notes)
      VALUES (@customer_id, @order_number, @platform, @order_date, @items, @total_amount, @notes)
    `);

    const result = stmt.run({
      customer_id: order.customer_id,
      order_number: order.order_number || null,
      platform: order.platform,
      order_date: order.order_date,
      items: order.items,
      total_amount: order.total_amount,
      notes: order.notes || null,
    });

    // Update customer order statistics
    CustomerModel.updateOrderStats(order.customer_id);

    return result.lastInsertRowid as number;
  }

  static findById(id: number): Order | undefined {
    const stmt = db.prepare('SELECT * FROM orders WHERE id = ?');
    return stmt.get(id) as Order | undefined;
  }

  static findByCustomerId(customerId: number): Order[] {
    const stmt = db.prepare('SELECT * FROM orders WHERE customer_id = ? ORDER BY order_date DESC');
    return stmt.all(customerId) as Order[];
  }

  static findAll(): Order[] {
    const stmt = db.prepare('SELECT * FROM orders ORDER BY order_date DESC');
    return stmt.all() as Order[];
  }

  static update(id: number, order: Partial<Order>): boolean {
    const updates: string[] = [];
    const params: any = { id };

    if (order.order_number !== undefined) {
      updates.push('order_number = @order_number');
      params.order_number = order.order_number;
    }
    if (order.platform !== undefined) {
      updates.push('platform = @platform');
      params.platform = order.platform;
    }
    if (order.order_date !== undefined) {
      updates.push('order_date = @order_date');
      params.order_date = order.order_date;
    }
    if (order.items !== undefined) {
      updates.push('items = @items');
      params.items = order.items;
    }
    if (order.total_amount !== undefined) {
      updates.push('total_amount = @total_amount');
      params.total_amount = order.total_amount;
    }
    if (order.notes !== undefined) {
      updates.push('notes = @notes');
      params.notes = order.notes;
    }

    if (updates.length === 0) return false;

    const stmt = db.prepare(`UPDATE orders SET ${updates.join(', ')} WHERE id = @id`);
    const result = stmt.run(params);

    if (result.changes > 0 && order.customer_id) {
      CustomerModel.updateOrderStats(order.customer_id);
    }

    return result.changes > 0;
  }

  static delete(id: number): boolean {
    const order = OrderModel.findById(id);
    const stmt = db.prepare('DELETE FROM orders WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes > 0 && order) {
      CustomerModel.updateOrderStats(order.customer_id);
    }

    return result.changes > 0;
  }
}
