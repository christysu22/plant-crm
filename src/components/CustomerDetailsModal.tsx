'use client';

import { CustomerWithDetails, NoteType } from '@/types';

interface CustomerDetailsModalProps {
  customer: CustomerWithDetails;
  onClose: () => void;
  onUpdate: () => void;
}

export default function CustomerDetailsModal({ customer, onClose, onUpdate }: CustomerDetailsModalProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const addNote = async (noteType: NoteType) => {
    const content = prompt(`Enter ${noteType} note:`);
    if (!content) return;

    try {
      await fetch(`/api/customers/${customer.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note_type: noteType, content }),
      });
      onUpdate();
    } catch (error) {
      console.error('Failed to add note:', error);
      alert('Failed to add note');
    }
  };

  const addTag = async () => {
    const tag = prompt('Enter tag:');
    if (!tag) return;

    try {
      await fetch(`/api/customers/${customer.id}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag }),
      });
      onUpdate();
    } catch (error) {
      console.error('Failed to add tag:', error);
      alert('Failed to add tag');
    }
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={onClose}>
          &times;
        </span>

        <div className="details-header">
          <h2>{customer.name}</h2>
          <div className="customer-badges">
            <span className="badge badge-platform">{customer.platform}</span>
            {customer.is_seller && <span className="badge badge-seller">Seller</span>}
          </div>
          <div className="customer-info" style={{ marginTop: '15px' }}>
            {customer.email && <p>Email: {customer.email}</p>}
            {customer.phone && <p>Phone: {customer.phone}</p>}
          </div>
        </div>

        <div className="details-section">
          <h3>Order History ({customer.orders?.length || 0})</h3>
          {customer.orders && customer.orders.length > 0 ? (
            customer.orders.map((order) => (
              <div key={order.id} className="order-item">
                <div>
                  <strong>{order.platform}</strong> - {formatDate(order.order_date)}
                </div>
                {order.order_number && <div>Order #{order.order_number}</div>}
                <div>Items: {order.items}</div>
                <div>
                  <strong>Amount: ${order.total_amount.toFixed(2)}</strong>
                </div>
                {order.notes && (
                  <div style={{ marginTop: '10px', fontStyle: 'italic' }}>{order.notes}</div>
                )}
              </div>
            ))
          ) : (
            <p>No orders yet</p>
          )}
        </div>

        <div className="details-section">
          <h3>Notes & Feedback</h3>
          <button className="btn btn-primary" onClick={() => addNote('satisfaction')}>
            Add Satisfaction Note
          </button>
          <button className="btn btn-primary" onClick={() => addNote('deal')} style={{ marginLeft: '10px' }}>
            Add Deal/Promotion
          </button>
          <button className="btn btn-primary" onClick={() => addNote('general')} style={{ marginLeft: '10px' }}>
            Add General Note
          </button>
          <div style={{ marginTop: '15px' }}>
            {customer.notes && customer.notes.length > 0 ? (
              customer.notes.map((note) => (
                <div key={note.id} className="note-item">
                  <div className="note-type">{note.note_type}</div>
                  <div>{note.content}</div>
                  <div style={{ fontSize: '12px', color: '#718096', marginTop: '5px' }}>
                    {formatDate(note.created_at)}
                  </div>
                </div>
              ))
            ) : (
              <p>No notes yet</p>
            )}
          </div>
        </div>

        <div className="details-section">
          <h3>Tags</h3>
          <button className="btn btn-primary" onClick={addTag}>
            Add Tag
          </button>
          <div className="tags-container" style={{ marginTop: '10px' }}>
            {customer.tags && customer.tags.length > 0 ? (
              customer.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))
            ) : (
              <p>No tags yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
