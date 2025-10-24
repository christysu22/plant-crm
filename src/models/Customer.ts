import { db } from '../database/db';
import { Customer, CustomerFilter, CustomerWithDetails } from '../types';

export class CustomerModel {
  static create(customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): number {
    const stmt = db.prepare(`
      INSERT INTO customers (name, email, phone, platform, is_seller, total_orders, total_spent, first_purchase_date, last_purchase_date)
      VALUES (@name, @email, @phone, @platform, @is_seller, @total_orders, @total_spent, @first_purchase_date, @last_purchase_date)
    `);

    const result = stmt.run({
      name: customer.name,
      email: customer.email || null,
      phone: customer.phone || null,
      platform: customer.platform,
      is_seller: customer.is_seller ? 1 : 0,
      total_orders: customer.total_orders || 0,
      total_spent: customer.total_spent || 0,
      first_purchase_date: customer.first_purchase_date || null,
      last_purchase_date: customer.last_purchase_date || null,
    });

    return result.lastInsertRowid as number;
  }

  static findById(id: number): Customer | undefined {
    const stmt = db.prepare('SELECT * FROM customers WHERE id = ?');
    const row = stmt.get(id) as any;

    if (!row) return undefined;

    return {
      ...row,
      is_seller: row.is_seller === 1,
    };
  }

  static findAll(filter?: CustomerFilter): Customer[] {
    let query = 'SELECT DISTINCT c.* FROM customers c';
    const params: any[] = [];
    const conditions: string[] = [];

    if (filter?.tag) {
      query += ' INNER JOIN customer_tags ct ON c.id = ct.customer_id';
      conditions.push('ct.tag = ?');
      params.push(filter.tag);
    }

    if (filter?.platform) {
      conditions.push('(c.platform = ? OR c.platform = ?)');
      params.push(filter.platform, 'Both');
    }

    if (filter?.is_seller !== undefined) {
      conditions.push('c.is_seller = ?');
      params.push(filter.is_seller ? 1 : 0);
    }

    if (filter?.min_orders) {
      conditions.push('c.total_orders >= ?');
      params.push(filter.min_orders);
    }

    if (filter?.search) {
      conditions.push('(c.name LIKE ? OR c.email LIKE ? OR c.phone LIKE ?)');
      const searchTerm = `%${filter.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY c.last_purchase_date DESC, c.created_at DESC';

    const stmt = db.prepare(query);
    const rows = stmt.all(...params) as any[];

    return rows.map(row => ({
      ...row,
      is_seller: row.is_seller === 1,
    }));
  }

  static update(id: number, customer: Partial<Customer>): boolean {
    const updates: string[] = [];
    const params: any = { id };

    if (customer.name !== undefined) {
      updates.push('name = @name');
      params.name = customer.name;
    }
    if (customer.email !== undefined) {
      updates.push('email = @email');
      params.email = customer.email;
    }
    if (customer.phone !== undefined) {
      updates.push('phone = @phone');
      params.phone = customer.phone;
    }
    if (customer.platform !== undefined) {
      updates.push('platform = @platform');
      params.platform = customer.platform;
    }
    if (customer.is_seller !== undefined) {
      updates.push('is_seller = @is_seller');
      params.is_seller = customer.is_seller ? 1 : 0;
    }

    if (updates.length === 0) return false;

    updates.push('updated_at = CURRENT_TIMESTAMP');

    const stmt = db.prepare(`UPDATE customers SET ${updates.join(', ')} WHERE id = @id`);
    const result = stmt.run(params);

    return result.changes > 0;
  }

  static delete(id: number): boolean {
    const stmt = db.prepare('DELETE FROM customers WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  static updateOrderStats(customerId: number): void {
    const stmt = db.prepare(`
      UPDATE customers
      SET
        total_orders = (SELECT COUNT(*) FROM orders WHERE customer_id = ?),
        total_spent = (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE customer_id = ?),
        first_purchase_date = (SELECT MIN(order_date) FROM orders WHERE customer_id = ?),
        last_purchase_date = (SELECT MAX(order_date) FROM orders WHERE customer_id = ?),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(customerId, customerId, customerId, customerId, customerId);
  }
}
