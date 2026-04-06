import React, { createContext, useState, useEffect, useContext } from 'react';
import { cartAPI } from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart(null);
      setItemCount(0);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await cartAPI.getCart();
      setCart(res.data.cart);
      setItemCount(res.data.cart?.items?.length || 0);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      return { success: false, error: 'Please login to add items to cart' };
    }

    try {
      setLoading(true);
      const res = await cartAPI.addItem({ productId, quantity });
      setCart(res.data.cart);
      setItemCount(res.data.cart.items.length);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add item';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      setLoading(true);
      const res = await cartAPI.updateItem(productId, { quantity });
      setCart(res.data.cart);
      setItemCount(res.data.cart.items.length);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update quantity';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setLoading(true);
      const res = await cartAPI.removeItem(productId);
      setCart(res.data.cart);
      setItemCount(res.data.cart.items.length);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove item';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await cartAPI.clearCart();
      setCart(null);
      setItemCount(0);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to clear cart';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cart,
    loading,
    itemCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart,
    totalAmount: cart?.totalAmount || 0
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};