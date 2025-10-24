'use client';

import { useState, FormEvent } from 'react';
import { Platform } from '@/types';

interface CustomerModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CustomerModal({ onClose, onSuccess }: CustomerModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [platform, setPlatform] = useState<Platform>('PalmStreet');
  const [isSeller, setIsSeller] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const customer = {
      name,
      email: email || undefined,
      phone: phone || undefined,
      platform,
      is_seller: isSeller,
      total_orders: 0,
      total_spent: 0,
    };

    try {
      await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer),
      });
      onSuccess();
    } catch (error) {
      console.error('Failed to create customer:', error);
      alert('Failed to create customer');
    }
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Add Customer</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Platform *</label>
            <select
              required
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
            >
              <option value="PalmStreet">PalmStreet</option>
              <option value="Etsy">Etsy</option>
              <option value="Both">Both</option>
            </select>
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={isSeller}
                onChange={(e) => setIsSeller(e.target.checked)}
              />
              Is this customer also a seller?
            </label>
          </div>
          <button type="submit" className="btn btn-primary">
            Save Customer
          </button>
        </form>
      </div>
    </div>
  );
}
