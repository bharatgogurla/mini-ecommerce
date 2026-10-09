import React from 'react';
import './CategoryFilter.css';

export const CategoryFilter = ({ categories = [], selectedCategory, onSelectCategory }) => {
  return (
    <div className="category-filter-container" role="group" aria-label="Filter by category">
      <button
        type="button"
        className={`category-pill ${selectedCategory === 'All' ? 'active' : ''}`}
        onClick={() => onSelectCategory('All')}
      >
        All Categories
      </button>

      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
          onClick={() => onSelectCategory(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};
