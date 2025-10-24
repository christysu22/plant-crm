import { db } from '../database/db';
import { CustomerNote } from '../types';

export class CustomerNoteModel {
  static create(note: Omit<CustomerNote, 'id' | 'created_at'>): number {
    const stmt = db.prepare(`
      INSERT INTO customer_notes (customer_id, note_type, content)
      VALUES (@customer_id, @note_type, @content)
    `);

    const result = stmt.run({
      customer_id: note.customer_id,
      note_type: note.note_type,
      content: note.content,
    });

    return result.lastInsertRowid as number;
  }

  static findByCustomerId(customerId: number): CustomerNote[] {
    const stmt = db.prepare('SELECT * FROM customer_notes WHERE customer_id = ? ORDER BY created_at DESC');
    return stmt.all(customerId) as CustomerNote[];
  }

  static delete(id: number): boolean {
    const stmt = db.prepare('DELETE FROM customer_notes WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}
