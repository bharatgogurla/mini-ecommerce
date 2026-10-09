import React, { createContext, useReducer, useEffect, useState, useMemo } from 'react';
import { cartReducer, CART_ACTIONS } from '../reducers/cartReducer';
import { getEnrichedCartItems, calculateTotalItems, calculateSubtotal, calculateShipping } from '../utils/cartUtils';

export const CartContext = createContext(null);

const STORAGE_KEY = 'shopease_cart_v1';

/**
 * Safely loads and validates initial cart items from localStorage
 */
const getInitialCartState = () => {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) return { items: [] };
    const parsed = JSON.parse(rawData);
    if (!Array.isArray(parsed)) return { items: [] };

    // Basic structure validation
    const validItems = parsed.filter(
      (item) => item && typeof item === 'object' && item.id && Number(item.quantity) > 0
    );

    return { items: validItems };
  } catch (error) {
    console.error('Failed to parse cart state from localStorage:', error);
    return { items: [] };
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, null, getInitialCartState);
  const [toastMessage, setToastMessage] = useState(null);

  // Helper for displaying temporary toast notifications
  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type, id: Date.now() });
  };

  const hideToast = () => {
    setToastMessage(null);
  };

  // Sync state.items to localStorage on state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch (error) {
      console.error('Failed to save cart state to localStorage:', error);
    }
  }, [state.items]);

  // Derived calculations
  const enrichedItems = useMemo(() => getEnrichedCartItems(state.items), [state.items]);
  const totalItems = useMemo(() => calculateTotalItems(state.items), [state.items]);
  const subtotal = useMemo(() => calculateSubtotal(enrichedItems), [enrichedItems]);
  const shipping = useMemo(() => calculateShipping(subtotal), [subtotal]);
  const totalPrice = subtotal + shipping;

  // Action Dispatchers
  const addToCart = (id, quantity = 1) => {
    dispatch({ type: CART_ACTIONS.ADD_TO_CART, payload: { id, quantity } });
    showToast('Item added to cart!', 'success');
  };

  const removeFromCart = (id) => {
    dispatch({ type: CART_ACTIONS.REMOVE_FROM_CART, payload: id });
    showToast('Item removed from cart', 'info');
  };

  const increaseQuantity = (id) => {
    dispatch({ type: CART_ACTIONS.INCREASE_QUANTITY, payload: id });
  };

  const decreaseQuantity = (id) => {
    dispatch({ type: CART_ACTIONS.DECREASE_QUANTITY, payload: id });
  };

  const updateQuantity = (id, quantity) => {
    dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
    showToast('Cart cleared', 'info');
  };

  const contextValue = {
    cartItems: state.items,
    enrichedItems,
    totalItems,
    subtotal,
    shipping,
    totalPrice,
    toastMessage,
    showToast,
    hideToast,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    updateQuantity,
    clearCart
  };

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};
