import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../data/productService';
import { ProductGrid } from '../components/ProductGrid';
import { SearchBar } from '../components/SearchBar';
import { CategoryFilter } from '../components/CategoryFilter';
import { SortDropdown } from '../components/SortDropdown';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { Sparkles, ArrowDown } from 'lucide-react';
import './Home.css';

export const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const catalogRef = useRef(null);

  // Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [sortBy, setSortBy] = useState('default');

  // Async loading simulation
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = productService.getAllProducts();
      const catList = productService.getCategories();
      setProducts(data);
      setCategories(catList);
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError('Unable to load product catalog. Please try again.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Update selectedCategory if URL search param changes
  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam) {
      setSelectedCategory(catParam);
    }
  }, [searchParams]);

  // Sync category change with URL params
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category });
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSortBy('default');
    searchParams.delete('category');
    setSearchParams(searchParams);
  };

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Derived filtered & sorted product list
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Search filter
    const trimmedQuery = searchTerm.trim().toLowerCase();
    if (trimmedQuery) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(trimmedQuery) ||
          p.description.toLowerCase().includes(trimmedQuery)
      );
    }

    // 2. Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // 3. Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'default':
      default:
        // Keep initial dataset ordering
        break;
    }

    return result;
  }, [products, searchTerm, selectedCategory, sortBy]);

  const hasActiveFilters = searchTerm.trim() !== '' || selectedCategory !== 'All' || sortBy !== 'default';

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content fade-in">
            <div className="hero-pill">
              <Sparkles size={16} />
              <span>Premium Collection 2026</span>
            </div>
            <h1 className="hero-title">
              Discover Quality Products for Your <span className="title-highlight">Everyday Life</span>
            </h1>
            <p className="hero-subtitle">
              Explore curated electronics, fashion, home essentials, and beauty products with free shipping and hassle-free returns.
            </p>
            <div className="hero-cta-group">
              <button className="btn btn-primary btn-lg hero-cta-btn" onClick={scrollToCatalog}>
                <span>Shop Now</span>
                <ArrowDown size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Product Catalog Section */}
      <section className="container catalog-section" ref={catalogRef}>
        {/* Controls Bar: Search, Filter, Sort */}
        <div className="catalog-controls">
          <div className="controls-top-row">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <SortDropdown sortBy={sortBy} onSortChange={setSortBy} />
          </div>

          <div className="controls-bottom-row">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
            />
          </div>
        </div>

        {/* Results Counter & Clear Filters */}
        <div className="catalog-meta">
          <span className="results-count">
            Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> products
          </span>

          {hasActiveFilters && (
            <button className="btn btn-outline btn-sm clear-filters-btn" onClick={handleClearFilters}>
              Reset All Filters
            </button>
          )}
        </div>

        {/* Catalog Body States */}
        {isLoading ? (
          <LoadingSpinner label="Fetching products catalog..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchProducts} />
        ) : filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <EmptyState
            type="no-results"
            title="No matching products found"
            message={`We couldn't find any products matching "${searchTerm || selectedCategory}". Try checking for typos or resetting your filters.`}
            actionLabel="Clear Filters"
            onAction={handleClearFilters}
          />
        )}
      </section>
    </div>
  );
};
