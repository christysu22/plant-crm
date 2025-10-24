'use client';

import { Customer } from '@/types';

interface CustomerListProps {
  customers: Customer[];
  onViewDetails: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function CustomerList({ customers, onViewDetails, onDelete }: CustomerListProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (customers.length === 0) {
    return (
      <section className="customers-section">
        <h2>Customers</h2>
        <div className="empty-state">No customers found. Add your first customer to get started!</div>
      </section>
    );
  }

  return (
    <section className="customers-section">
      <h2>Customers</h2>
      <div className="customers-list">
        {customers.map((customer) => (
          <div key={customer.id} className="customer-card">
            <div className="customer-header">
              <div className="customer-name">{customer.name}</div>
              <div className="customer-badges">
                <span className="badge badge-platform">{customer.platform}</span>
                {customer.is_seller && <span className="badge badge-seller">Seller</span>}
              </div>
            </div>
            <div className="customer-info">
              {customer.email && <p>Email: {customer.email}</p>}
              {customer.phone && <p>Phone: {customer.phone}</p>}
            </div>
            <div className="customer-stats">
              <div className="stat-box">
                <div className="stat-value">{customer.total_orders}</div>
                <div className="stat-label">Total Orders</div>
              </div>
              <div className="stat-box">
                <div className="stat-value">${customer.total_spent.toFixed(2)}</div>
                <div className="stat-label">Total Spent</div>
              </div>
              {customer.last_purchase_date && (
                <div className="stat-box">
                  <div className="stat-value">{formatDate(customer.last_purchase_date)}</div>
                  <div className="stat-label">Last Purchase</div>
                </div>
              )}
            </div>
            <div className="customer-actions">
              <button className="btn btn-info" onClick={() => onViewDetails(customer.id!)}>
                View Details
              </button>
              <button className="btn btn-danger" onClick={() => onDelete(customer.id!)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
