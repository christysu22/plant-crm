import { db } from '../database/db';
import { CustomerTag } from '../types';

export class CustomerTagModel {
  static addTag(customerId: number, tag: string): void {
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO customer_tags (customer_id, tag)
      VALUES (?, ?)
    `);

    stmt.run(customerId, tag);
  }

  static removeTag(customerId: number, tag: string): boolean {
    const stmt = db.prepare('DELETE FROM customer_tags WHERE customer_id = ? AND tag = ?');
    const result = stmt.run(customerId, tag);
    return result.changes > 0;
  }

  static findByCustomerId(customerId: number): string[] {
    const stmt = db.prepare('SELECT tag FROM customer_tags WHERE customer_id = ? ORDER BY tag');
    const rows = stmt.all(customerId) as { tag: string }[];
    return rows.map(row => row.tag);
  }

  static getAllTags(): string[] {
    const stmt = db.prepare('SELECT DISTINCT tag FROM customer_tags ORDER BY tag');
    const rows = stmt.all() as { tag: string }[];
    return rows.map(row => row.tag);
  }
}
