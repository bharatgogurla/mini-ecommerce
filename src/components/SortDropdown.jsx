import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import './SortDropdown.css';

export const SORT_OPTIONS = [
  { value: 'default', label: 'Featured / Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Rating: High to Low' }
];

export const SortDropdown = ({ sortBy, onSortChange }) => {
  return (
    <div className="sort-dropdown-container">
      <label htmlFor="sort-select" className="sort-label">
        <ArrowUpDown size={16} />
        <span>Sort by:</span>
      </label>
      <select
        id="sort-select"
        className="sort-select"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        aria-label="Sort products"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
