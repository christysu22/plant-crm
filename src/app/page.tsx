'use client';

import { useState, useEffect } from 'react';
import CustomerList from '@/components/CustomerList';
import CustomerFilters from '@/components/CustomerFilters';
import CustomerModal from '@/components/CustomerModal';
import OrderModal from '@/components/OrderModal';
import CustomerDetailsModal from '@/components/CustomerDetailsModal';
import { Customer, CustomerFilter, CustomerWithDetails } from '@/types';

export default function Home() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filter, setFilter] = useState<CustomerFilter>({});
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerWithDetails | null>(null);

  const loadCustomers = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.search) params.append('search', filter.search);
      if (filter.platform) params.append('platform', filter.platform);
      if (filter.is_seller !== undefined) params.append('is_seller', String(filter.is_seller));
      if (filter.min_orders) params.append('min_orders', String(filter.min_orders));
      if (filter.tag) params.append('tag', filter.tag);

      const response = await fetch(`/api/customers?${params}`);
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Failed to load customers:', error);
    }
  };

  const loadCustomerDetails = async (id: number) => {
    try {
      const response = await fetch(`/api/customers/${id}`);
      const data = await response.json();
      setSelectedCustomer(data);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Failed to load customer details:', error);
    }
  };

  const deleteCustomer = async (id: number) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;

    try {
      await fetch(`/api/customers/${id}`, { method: 'DELETE' });
      loadCustomers();
    } catch (error) {
      console.error('Failed to delete customer:', error);
      alert('Failed to delete customer');
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [filter]);

  return (
    <div className="container">
      <header>
        <h1>Plant CRM</h1>
        <p>Customer Relations Management for Plant Business</p>
      </header>

      <div className="main-content">
        <CustomerFilters filter={filter} setFilter={setFilter} />

        <section className="actions">
          <button className="btn btn-success" onClick={() => setShowCustomerModal(true)}>
            Add Customer
          </button>
          <button className="btn btn-success" onClick={() => setShowOrderModal(true)}>
            Add Order
          </button>
        </section>

        <CustomerList
          customers={customers}
          onViewDetails={loadCustomerDetails}
          onDelete={deleteCustomer}
        />
      </div>

      {showCustomerModal && (
        <CustomerModal
          onClose={() => setShowCustomerModal(false)}
          onSuccess={() => {
            setShowCustomerModal(false);
            loadCustomers();
          }}
        />
      )}

      {showOrderModal && (
        <OrderModal
          onClose={() => setShowOrderModal(false)}
          onSuccess={() => {
            setShowOrderModal(false);
            loadCustomers();
          }}
        />
      )}

      {showDetailsModal && selectedCustomer && (
        <CustomerDetailsModal
          customer={selectedCustomer}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedCustomer(null);
          }}
          onUpdate={() => {
            if (selectedCustomer) {
              loadCustomerDetails(selectedCustomer.id!);
              loadCustomers();
            }
          }}
        />
      )}
    </div>
  );
}
