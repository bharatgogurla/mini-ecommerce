import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import './Footer.css';

export const Footer = () => {
  return (
    <footer className="footer">
      {/* Value Propositions */}
      <div className="footer-features">
        <div className="container features-grid">
          <div className="feature-item">
            <Truck size={24} className="feature-icon" />
            <div>
              <h4>Free Delivery</h4>
              <p>Free shipping on orders above ₹999</p>
            </div>
          </div>
          <div className="feature-item">
            <ShieldCheck size={24} className="feature-icon" />
            <div>
              <h4>Secure Shopping</h4>
              <p>100% authentic local product guarantee</p>
            </div>
          </div>
          <div className="feature-item">
            <RefreshCw size={24} className="feature-icon" />
            <div>
              <h4>Easy Returns</h4>
              <p>Hassle-free 30-day return policy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="container footer-main">
        <div className="footer-col brand-col">
          <div className="footer-logo">
            <ShoppingBag size={20} />
            <span>ShopEase</span>
          </div>
          <p className="footer-desc">
            Your destination for premium tech, fashion, home essentials, and lifestyle products with unmatched quality.
          </p>
        </div>

        <div className="footer-col">
          <h5 className="footer-heading">Quick Links</h5>
          <ul className="footer-links">
            <li><Link to="/">Products Catalog</Link></li>
            <li><Link to="/cart">Shopping Cart</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5 className="footer-heading">Categories</h5>
          <ul className="footer-links">
            <li><Link to="/?category=Electronics">Electronics</Link></li>
            <li><Link to="/?category=Fashion">Fashion</Link></li>
            <li><Link to="/?category=Home%20%26%20Living">Home & Living</Link></li>
            <li><Link to="/?category=Accessories">Accessories</Link></li>
            <li><Link to="/?category=Beauty">Beauty</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container bottom-content">
          <p>© {new Date().getFullYear()} ShopEase | All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
