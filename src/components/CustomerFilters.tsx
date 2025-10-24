'use client';

import { useState, useEffect } from 'react';
import { CustomerFilter, Platform } from '@/types';

interface CustomerFiltersProps {
  filter: CustomerFilter;
  setFilter: (filter: CustomerFilter) => void;
}

export default function CustomerFilters({ filter, setFilter }: CustomerFiltersProps) {
  const [localFilter, setLocalFilter] = useState<CustomerFilter>(filter);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      const response = await fetch('/api/tags');
      const data = await response.json();
      setTags(data);
    } catch (error) {
      console.error('Failed to load tags:', error);
    }
  };

  const applyFilters = () => {
    setFilter(localFilter);
  };

  const clearFilters = () => {
    const emptyFilter: CustomerFilter = {};
    setLocalFilter(emptyFilter);
    setFilter(emptyFilter);
  };

  return (
    <section className="filters">
      <h2>Filters</h2>
      <div className="filter-group">
        <input
          type="text"
          placeholder="Search customers..."
          value={localFilter.search || ''}
          onChange={(e) => setLocalFilter({ ...localFilter, search: e.target.value })}
        />
      </div>
      <div className="filter-group">
        <label>Platform:</label>
        <select
          value={localFilter.platform || ''}
          onChange={(e) =>
            setLocalFilter({ ...localFilter, platform: (e.target.value as Platform) || undefined })
          }
        >
          <option value="">All Platforms</option>
          <option value="PalmStreet">PalmStreet</option>
          <option value="Etsy">Etsy</option>
          <option value="Both">Both</option>
        </select>
      </div>
      <div className="filter-group">
        <label>
          <input
            type="checkbox"
            checked={localFilter.is_seller || false}
            onChange={(e) => setLocalFilter({ ...localFilter, is_seller: e.target.checked || undefined })}
          />
          Sellers Only
        </label>
      </div>
      <div className="filter-group">
        <label>Min Orders:</label>
        <input
          type="number"
          min="0"
          placeholder="0"
          value={localFilter.min_orders || ''}
          onChange={(e) =>
            setLocalFilter({ ...localFilter, min_orders: parseInt(e.target.value) || undefined })
          }
        />
      </div>
      <div className="filter-group">
        <label>Tag:</label>
        <select
          value={localFilter.tag || ''}
          onChange={(e) => setLocalFilter({ ...localFilter, tag: e.target.value || undefined })}
        >
          <option value="">All Tags</option>
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>
      <button className="btn btn-primary" onClick={applyFilters}>
        Apply Filters
      </button>
      <button className="btn btn-secondary" onClick={clearFilters} style={{ marginLeft: '10px' }}>
        Clear
      </button>
    </section>
  );
}
