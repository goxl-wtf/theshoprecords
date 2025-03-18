"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';
import { CartItem, CartState, Product, ProductWithDetails } from '@/utils/types';

interface CartContextType extends CartState {
  addToCart: (product: Product | ProductWithDetails, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
}

const defaultCartState: CartState = {
  items: [],
  itemCount: 0,
  totalAmount: 0,
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartState>(defaultCartState);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Calculate totals for cart
  const calculateTotals = (items: CartItem[]): { itemCount: number; totalAmount: number } => {
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    return { itemCount, totalAmount };
  };

  // Add a product to the cart
  const addToCart = (product: Product | ProductWithDetails, quantity = 1) => {
    setCart((prevCart) => {
      // Check if the product is already in the cart
      const existingItemIndex = prevCart.items.findIndex(item => item.id === product.id);
      
      // Get the main image URL or a placeholder
      const imageUrl = 'images' in product && product.images && product.images.length > 0
        ? product.images[0].url
        : 'https://via.placeholder.com/150';

      let updatedItems: CartItem[];

      if (existingItemIndex >= 0) {
        // If the product is already in the cart, update the quantity
        updatedItems = [...prevCart.items];
        const existingItem = updatedItems[existingItemIndex];
        const newQuantity = existingItem.quantity + quantity;
        
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          totalPrice: product.price * newQuantity,
        };
      } else {
        // If the product is not in the cart, add it
        const newItem: CartItem = {
          id: product.id,
          title: product.title,
          artist: product.artist,
          price: product.price,
          image: imageUrl,
          quantity,
          totalPrice: product.price * quantity,
        };
        updatedItems = [...prevCart.items, newItem];
      }

      // Calculate new totals
      const { itemCount, totalAmount } = calculateTotals(updatedItems);

      return {
        items: updatedItems,
        itemCount,
        totalAmount,
      };
    });
  };

  // Remove an item from the cart
  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => {
      const updatedItems = prevCart.items.filter(item => item.id !== itemId);
      const { itemCount, totalAmount } = calculateTotals(updatedItems);

      return {
        items: updatedItems,
        itemCount,
        totalAmount,
      };
    });
  };

  // Update the quantity of an item in the cart
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart((prevCart) => {
      const updatedItems = prevCart.items.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity,
            totalPrice: item.price * quantity,
          };
        }
        return item;
      });

      const { itemCount, totalAmount } = calculateTotals(updatedItems);

      return {
        items: updatedItems,
        itemCount,
        totalAmount,
      };
    });
  };

  // Clear the cart
  const clearCart = () => {
    setCart(defaultCartState);
  };

  // Check if a product is in the cart
  const isInCart = (productId: string) => {
    return cart.items.some(item => item.id === productId);
  };

  return (
    <CartContext.Provider
      value={{
        ...cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext; 