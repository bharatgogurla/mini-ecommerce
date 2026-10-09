import React, { useState } from 'react';
import { ArrowRight, Trash2, ShieldCheck, Tag } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import { useCart } from '../hooks/useCart';
import { ConfirmModal } from './ConfirmModal';
import './CartSummary.css';

export const CartSummary = ({ onOpenClearConfirm }) => {
  const { totalItems, subtotal, shipping, totalPrice } = useCart();
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  return (
    <div className="cart-summary-card">
      <h3 className="summary-title">Order Summary</h3>

      <div className="summary-rows">
        <div className="summary-row">
          <span className="row-label">Total Items ({totalItems} units)</span>
          <span className="row-value">{totalItems}</span>
        </div>

        <div className="summary-row">
          <span className="row-label">Subtotal</span>
          <span className="row-value">{formatCurrency(subtotal)}</span>
        </div>

        <div className="summary-row">
          <span className="row-label">Estimated Shipping</span>
          <span className="row-value">
            {shipping === 0 ? (
              <span className="free-shipping-tag">FREE</span>
            ) : (
              formatCurrency(shipping)
            )}
          </span>
        </div>

        {subtotal > 0 && subtotal < 999 && (
          <div className="shipping-progress-notice">
            <Tag size={14} />
            <span>
              Add <strong>{formatCurrency(999 - subtotal)}</strong> more for FREE Shipping!
            </span>
          </div>
        )}

        <div className="summary-divider" />

        <div className="summary-row total-row">
          <span className="total-label">Total Amount</span>
          <span className="total-amount">{formatCurrency(totalPrice)}</span>
        </div>
      </div>

      <div className="summary-actions">
        <button
          type="button"
          className="btn btn-primary btn-lg checkout-btn"
          onClick={() => setIsCheckoutModalOpen(true)}
          disabled={totalItems === 0}
        >
          <span>Proceed to Checkout</span>
          <ArrowRight size={18} />
        </button>

        <button
          type="button"
          className="btn btn-danger-outline btn-sm clear-cart-btn"
          onClick={onOpenClearConfirm}
          disabled={totalItems === 0}
        >
          <Trash2 size={16} />
          <span>Clear Shopping Cart</span>
        </button>
      </div>

      <div className="security-badge">
        <ShieldCheck size={16} />
        <span>Safe & Secure Local Checkout Demo</span>
      </div>

      {/* Demo Checkout Info Modal */}
      <ConfirmModal
        isOpen={isCheckoutModalOpen}
        title="Checkout Demo Notice"
        message="Thank you for testing ShopEase! This is a frontend-only take-home assignment application. Payment processing, user accounts, and real order placement are not connected to a backend."
        confirmLabel="Got It!"
        cancelLabel="Close"
        variant="info"
        onConfirm={() => setIsCheckoutModalOpen(false)}
        onCancel={() => setIsCheckoutModalOpen(false)}
      />
    </div>
  );
};
