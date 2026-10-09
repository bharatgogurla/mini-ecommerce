import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, Sparkles } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import './Navbar.css';

export const Navbar = () => {
  const { totalItems } = useCart();

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" aria-label="ShopEase Home">
          <div className="logo-icon-wrapper">
            <ShoppingBag size={22} className="logo-icon" />
          </div>
          <span className="brand-title">
            Shop<span className="brand-accent">Ease</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Home
          </NavLink>
          
          <NavLink
            to="/cart"
            className={({ isActive }) => `nav-link cart-nav-link ${isActive ? 'active' : ''}`}
            aria-label={`Shopping cart with ${totalItems} items`}
          >
            <div className="cart-icon-wrapper">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="cart-badge" key={totalItems}>
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </div>
            <span className="cart-link-text">Cart</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
};
