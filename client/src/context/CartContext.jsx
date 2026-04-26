import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import * as api from '../services/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({ items: [] });
      return;
    }
    try {
      setLoading(true);
      const { data } = await api.getCart();
      setCart(data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const { data } = await api.addToCart(productId, quantity);
      setCart(data);
      return data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to add to cart';
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const { data } = await api.updateCartItem(productId, quantity);
      setCart(data);
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update cart';
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const { data } = await api.removeFromCart(productId);
      setCart(data);
    } catch (error) {
      throw error.response?.data?.message || 'Failed to remove item';
    }
  };

  const clearCart = async () => {
    try {
      await api.clearCart();
      setCart({ items: [] });
    } catch (error) {
      throw error.response?.data?.message || 'Failed to clear cart';
    }
  };

  const cartItemCount = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const cartTotal =
    cart.items?.reduce((sum, item) => {
      const price = item.productId?.price || 0;
      return sum + price * item.quantity;
    }, 0) || 0;

  const value = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart,
    cartItemCount,
    cartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
