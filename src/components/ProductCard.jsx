import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, ImageOff } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import { RatingStars } from './RatingStars';
import { useCart } from '../hooks/useCart';
import './ProductCard.css';

export const ProductCard = ({ product }) => {
  const { addToCart, cartItems } = useCart();
  const [imgError, setImgError] = useState(false);

  if (!product) return null;

  const { id, name, category, price, rating, image, stock } = product;

  // Check how many units are currently in cart
  const cartItem = cartItems.find((item) => String(item.id) === String(id));
  const currentQuantityInCart = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = stock <= 0;
  const isMaxStockInCart = currentQuantityInCart >= stock;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || isMaxStockInCart) return;
    addToCart(id, 1);
  };

  return (
    <div className="product-card fade-in">
      {/* Product Image Area */}
      <div className="product-image-container">
        <Link to={`/products/${id}`} tabIndex={-1} aria-hidden="true">
          {!imgError && image ? (
            <img
              src={image}
              alt={name}
              className="product-image"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="product-image-fallback">
              <ImageOff size={32} />
              <span>Image Unavailable</span>
            </div>
          )}
        </Link>
        <span className="badge badge-primary category-badge">{category}</span>
        {currentQuantityInCart > 0 && (
          <span className="badge badge-success in-cart-badge">
            {currentQuantityInCart} in cart
          </span>
        )}
      </div>

      {/* Product Content Area */}
      <div className="product-info">
        <div className="product-rating-row">
          <RatingStars rating={rating} />
          <span className={`stock-status ${isOutOfStock ? 'out-of-stock' : 'in-stock'}`}>
            {isOutOfStock ? 'Out of stock' : `${stock} in stock`}
          </span>
        </div>

        <h3 className="product-title">
          <Link to={`/products/${id}`} title={name}>
            {name}
          </Link>
        </h3>

        <div className="product-footer">
          <div className="product-price">{formatCurrency(price)}</div>

          <div className="product-card-actions">
            <Link
              to={`/products/${id}`}
              className="btn btn-secondary btn-sm"
              title="View Product Details"
              aria-label={`View details for ${name}`}
            >
              <Eye size={16} />
            </Link>

            <button
              className="btn btn-primary btn-sm add-cart-btn"
              onClick={handleAddToCart}
              disabled={isOutOfStock || isMaxStockInCart}
              aria-label={`Add ${name} to cart`}
              title={
                isOutOfStock
                  ? 'Product out of stock'
                  : isMaxStockInCart
                  ? 'Maximum available stock in cart'
                  : 'Add to cart'
              }
            >
              <ShoppingCart size={16} />
              <span>{currentQuantityInCart > 0 ? 'Add More' : 'Add'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
