import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productService } from '../data/productService';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/formatCurrency';
import { RatingStars } from '../components/RatingStars';
import { QuantitySelector } from '../components/QuantitySelector';
import { ProductCard } from '../components/ProductCard';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ArrowLeft, ShoppingCart, Check, ImageOff, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import './ProductDetails.css';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setImgError(false);
    setQuantity(1);

    // Scroll window to top on route change
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const foundProduct = productService.getProductById(id);
    if (foundProduct) {
      setProduct(foundProduct);
      const related = productService.getRelatedProducts(foundProduct.category, foundProduct.id);
      setRelatedProducts(related);
    } else {
      setProduct(null);
    }
    setIsLoading(false);
  }, [id]);

  if (isLoading) {
    return <LoadingSpinner label="Loading product details..." />;
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '3rem 0' }}>
        <EmptyState
          type="not-found"
          title="Product Not Found"
          message="The product you are looking for doesn't exist or has been removed."
          actionLabel="Back to Products"
          onAction={() => navigate('/')}
        />
      </div>
    );
  }

  const { name, description, price, category, rating, image, stock } = product;

  const cartItem = cartItems.find((item) => String(item.id) === String(id));
  const currentInCart = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = stock <= 0;
  const remainingStockForCart = stock - currentInCart;

  const handleAddToCart = () => {
    if (isOutOfStock || remainingStockForCart <= 0) return;
    addToCart(id, quantity);
  };

  return (
    <div className="container product-details-page fade-in">
      {/* Back Button */}
      <div className="details-navigation">
        <Link to="/" className="back-link">
          <ArrowLeft size={18} />
          <span>Back to Products</span>
        </Link>
      </div>

      {/* Main Product Details Card */}
      <div className="product-details-grid">
        {/* Left Column: Image Showcase */}
        <div className="details-image-section">
          <div className="details-image-container">
            {!imgError && image ? (
              <img
                src={image}
                alt={name}
                className="details-image"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="details-image-fallback">
                <ImageOff size={48} />
                <span>Image Unavailable</span>
              </div>
            )}
            <span className="badge badge-primary details-category-badge">{category}</span>
          </div>
        </div>

        {/* Right Column: Info & Actions */}
        <div className="details-info-section">
          <h1 className="details-title">{name}</h1>

          <div className="details-rating-row">
            <RatingStars rating={rating} />
            <span className="rating-text">({rating} out of 5 stars)</span>
          </div>

          <div className="details-price-row">
            <span className="details-price">{formatCurrency(price)}</span>
            <span className={`badge ${isOutOfStock ? 'badge-danger' : 'badge-success'}`}>
              {isOutOfStock ? 'Out of Stock' : `${stock} Units Available`}
            </span>
          </div>

          <p className="details-description">{description}</p>

          <div className="details-divider" />

          {/* Add to Cart Controls */}
          <div className="details-purchase-box">
            <div className="quantity-field-group">
              <label className="field-label">Select Quantity:</label>
              <QuantitySelector
                quantity={quantity}
                stock={Math.max(1, remainingStockForCart)}
                onIncrease={() => setQuantity((q) => Math.min(q + 1, remainingStockForCart))}
                onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
                onChange={(val) => setQuantity(val)}
                disabled={isOutOfStock || remainingStockForCart <= 0}
                size="large"
              />
            </div>

            <button
              type="button"
              className="btn btn-primary btn-lg add-to-cart-big-btn"
              onClick={handleAddToCart}
              disabled={isOutOfStock || remainingStockForCart <= 0}
            >
              <ShoppingCart size={20} />
              <span>
                {isOutOfStock
                  ? 'Out of Stock'
                  : remainingStockForCart <= 0
                  ? 'Max Stock in Cart'
                  : `Add ${quantity} to Cart`}
              </span>
            </button>
          </div>

          {currentInCart > 0 && (
            <div className="in-cart-notice">
              <Check size={16} />
              <span>You currently have <strong>{currentInCart}</strong> of this item in your cart.</span>
            </div>
          )}

          {/* Guarantee Badges */}
          <div className="product-perks">
            <div className="perk-item">
              <Truck size={18} />
              <span>Fast Shipping Across India</span>
            </div>
            <div className="perk-item">
              <ShieldCheck size={18} />
              <span>100% Genuine Quality</span>
            </div>
            <div className="perk-item">
              <RefreshCw size={18} />
              <span>30-Day Hassle-Free Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="related-products-section">
          <h2 className="related-title">Related Products in {category}</h2>
          <div className="related-grid">
            {relatedProducts.map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
