"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { safeSetItem, safeGetItem, safeRemoveItem, clearLocalStorageIfCorrupted } from "@/lib/storage-utils";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  photo?: {
    data: Buffer;
    contentType: string;
  };
  isRental?: boolean;
  rentalUnit?: string;
  rentalDuration?: number;
  startDate?: string;
  endDate?: string;
}

// Optimized version for localStorage (without heavy photo data)
interface StoredCartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  isRental?: boolean;
  rentalUnit?: string;
  rentalDuration?: number;
  startDate?: string;
  endDate?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Helper function to convert CartItem to StoredCartItem (remove photo data)
  const optimizeForStorage = (items: CartItem[]): StoredCartItem[] => {
    return items.map(item => ({
      _id: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      isRental: item.isRental,
      rentalUnit: item.rentalUnit,
      rentalDuration: item.rentalDuration,
      startDate: item.startDate,
      endDate: item.endDate
    }));
  };

  // Helper function to restore CartItem from StoredCartItem
  const restoreFromStorage = (storedItems: StoredCartItem[]): CartItem[] => {
    return storedItems.map(item => ({
      ...item,
      photo: undefined // Photo will be loaded when needed via API
    }));
  };

  // Load cart from localStorage on mount (client-side only)
  useEffect(() => {
    const loadCart = () => {
      try {
        // Clear localStorage if corrupted
        clearLocalStorageIfCorrupted();
        
        const savedCart = safeGetItem("cart");
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart) as StoredCartItem[];
          setCart(restoreFromStorage(parsedCart));
        }
      } catch (error) {
        console.error("Error loading cart:", error);
        // Clear corrupted cart data
        safeRemoveItem("cart");
      } finally {
        setIsHydrated(true);
      }
    };

    // Only run on client side
    if (typeof window !== 'undefined') {
      loadCart();
    }
  }, []);

  // Save cart to localStorage whenever cart changes (only after hydration)
  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      const optimizedCart = optimizeForStorage(cart);
      const cartString = JSON.stringify(optimizedCart);
      
      // Check if the data is too large (localStorage limit is usually 5-10MB)
      if (cartString.length > 2 * 1024 * 1024) { // 2MB limit for safety
        console.warn("Cart data too large, keeping only recent items");
        // Keep only the last 10 items
        const reducedCart = optimizedCart.slice(-10);
        const success = safeSetItem("cart", JSON.stringify(reducedCart));
        if (success) {
          setCart(restoreFromStorage(reducedCart));
        }
      } else {
        const success = safeSetItem("cart", cartString);
        if (!success) {
          console.warn("Failed to save cart, keeping only essential items");
          // Keep only essential items (first 5)
          const essentialCart = optimizedCart.slice(0, 5);
          safeSetItem("cart", JSON.stringify(essentialCart));
          setCart(restoreFromStorage(essentialCart));
        }
      }
    }
  }, [cart, isHydrated]);

  const addToCart = (item: CartItem) => {
    setCart(prevCart => {
      // For rental items, check if same item with same dates exists
      const existingItem = prevCart.find(cartItem => {
        if (item.isRental && cartItem.isRental) {
          return cartItem._id === item._id && 
                 cartItem.startDate === item.startDate && 
                 cartItem.endDate === item.endDate;
        }
        return cartItem._id === item._id && !cartItem.isRental;
      });

      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem._id === item._id && 
          (!item.isRental || (cartItem.startDate === item.startDate && cartItem.endDate === item.endDate))
            ? { ...cartItem, quantity: cartItem.quantity + (item.quantity || 1) }
            : cartItem
        );
      }
      
      // Remove photo data to prevent storage issues
      const optimizedItem = { ...item, photo: undefined };
      return [...prevCart, optimizedItem];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item._id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item._id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    if (typeof window !== 'undefined') {
      safeRemoveItem("cart");
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};