'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Customer } from '@/types';

interface OrderModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function OrderModal({ onClose, onSuccess }: OrderModalProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerId, setCustomerId] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [platform, setPlatform] = useState<'PalmStreet' | 'Etsy'>('PalmStreet');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Failed to load customers:', error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const order = {
      customer_id: parseInt(customerId),
      order_number: orderNumber || undefined,
      platform,
      order_date: orderDate,
      items,
      total_amount: parseFloat(totalAmount),
      notes: notes || undefined,
    };

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
      onSuccess();
    } catch (error) {
      console.error('Failed to create order:', error);
      alert('Failed to create order');
    }
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Add Order</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Customer *</label>
            <select
              required
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
            >
              <option value="">Select a customer...</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Order Number</label>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Platform *</label>
            <select
              required
              value={platform}
              onChange={(e) => setPlatform(e.target.value as 'PalmStreet' | 'Etsy')}
            >
              <option value="PalmStreet">PalmStreet</option>
              <option value="Etsy">Etsy</option>
            </select>
          </div>
          <div className="form-group">
            <label>Order Date *</label>
            <input
              type="date"
              required
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Items *</label>
            <textarea
              rows={3}
              required
              placeholder="List the plants purchased..."
              value={items}
              onChange={(e) => setItems(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Total Amount *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea
              rows={2}
              placeholder="Any additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Save Order
          </button>
        </form>
      </div>
    </div>
  );
}
