"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';
import { CartItem, CartState, Product, ProductWithDetails, Listing } from '@/utils/types';

interface CartContextType extends CartState {
  addToCart: (product: Product | ProductWithDetails, quantity?: number, listing?: Listing) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string, listingId?: string) => boolean;
  getCartItemsBySeller: () => Record<string, CartItem[]>;
  getSellerSubtotal: (sellerId: string) => number;
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

  // Group cart items by seller
  const getCartItemsBySeller = (): Record<string, CartItem[]> => {
    const groupedItems: Record<string, CartItem[]> = {};
    
    // First group: items without seller_id (official store)
    const officialItems = cart.items.filter(item => !item.seller_id);
    if (officialItems.length > 0) {
      groupedItems['official'] = officialItems;
    }
    
    // Group all items with seller_id
    cart.items.forEach(item => {
      if (item.seller_id) {
        if (!groupedItems[item.seller_id]) {
          groupedItems[item.seller_id] = [];
        }
        groupedItems[item.seller_id].push(item);
      }
    });
    
    return groupedItems;
  };
  
  // Get subtotal for a specific seller
  const getSellerSubtotal = (sellerId: string): number => {
    const sellerItems = cart.items.filter(item => 
      sellerId === 'official' ? !item.seller_id : item.seller_id === sellerId
    );
    
    return sellerItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Add a product to the cart
  const addToCart = (product: Product | ProductWithDetails, quantity = 1, listing?: Listing) => {
    setCart((prevCart) => {
      // Get the ID to use - either listing ID or product ID
      const itemId = listing ? `listing-${listing.id}` : product.id;
      
      // Check if the item is already in the cart
      const existingItemIndex = prevCart.items.findIndex(item => item.id === itemId);
      
      // Get the main image URL or a placeholder
      const imageUrl = 'images' in product && product.images && product.images.length > 0
        ? product.images[0].url
        : 'https://via.placeholder.com/150';

      // Get the price to use - from listing or product
      const price = listing ? listing.price : product.price;
      
      // Get seller info if available from listing
      const sellerId = listing?.seller_id;
      const sellerName = listing?.seller?.store_name || (listing?.seller_id ? 'Marketplace Seller' : undefined);
      
      let updatedItems: CartItem[];

      if (existingItemIndex >= 0) {
        // If the item is already in the cart, update the quantity
        updatedItems = [...prevCart.items];
        const existingItem = updatedItems[existingItemIndex];
        const newQuantity = existingItem.quantity + quantity;
        
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          totalPrice: price * newQuantity,
        };
      } else {
        // If the item is not in the cart, add it
        const newItem: CartItem = {
          id: itemId,
          title: product.title,
          artist: product.artist,
          price: price,
          image: imageUrl,
          quantity,
          totalPrice: price * quantity,
          seller_id: sellerId,
          seller_name: sellerName,
          listing_id: listing?.id,
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

  // Check if a product or listing is in the cart
  const isInCart = (productId: string, listingId?: string) => {
    if (listingId) {
      return cart.items.some(item => item.id === `listing-${listingId}`);
    }
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
        getCartItemsBySeller,
        getSellerSubtotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext; 