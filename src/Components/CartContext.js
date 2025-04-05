// src/Components/CartContext.js

import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null); // Initialize with null or default shape

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === null) {
        // This check helps if the hook is accidentally used outside the provider
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

const LOCAL_STORAGE_KEY_PREFIX = "cart_";

// Load cart from localStorage for a specific user
const loadCartFromStorage = (email) => {
  try {
    // Ensure email is valid before creating key
    if (!email) return [];
    const storedCart = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${email}`);
    return storedCart ? JSON.parse(storedCart) : [];
  } catch {
    console.error("Failed to parse cart from localStorage");
    return [];
  }
};

// Save cart to localStorage for a specific user
const saveCartToStorage = (email, cart) => {
  // Ensure email is valid before saving
  if (!email) return;
  try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${email}`, JSON.stringify(cart));
  } catch {
      console.error("Failed to save cart to localStorage");
  }
};

export const CartProvider = ({ children, email }) => { // Receives email, presumably of logged-in user
  // Initialize state by loading from storage based on the initial email prop
  const [cart, setCart] = useState(() => loadCartFromStorage(email));

  // Effect to reload cart if the user email changes (e.g., login/logout)
  useEffect(() => {
    if (email) {
      const storedCart = loadCartFromStorage(email);
      setCart(storedCart);
      console.log(`Cart loaded for user: ${email}`, storedCart);
    } else {
      // If email becomes null (logout), clear the cart state
      setCart([]);
      console.log("User logged out or email cleared, cart state cleared.");
    }
  }, [email]); // Dependency: only run when email prop changes

  // Effect to save cart to localStorage whenever cart state changes
  // This runs *after* the cart state has been updated by addToCart, removeFromCart, or clearCart
  useEffect(() => {
    if (email) {
      saveCartToStorage(email, cart);
      console.log(`Cart saved for user: ${email}`, cart);
    }
    // Do not save if email is null/undefined
  }, [cart, email]); // Dependency: run when cart or email changes

  const addToCart = (itemToAdd) => {
    setCart((prevCart) => {
        console.log("Adding item:", itemToAdd);
        // Check if item already exists based on productId
        // Use itemToAdd.productId consistently if available
        const existingItemIndex = prevCart.findIndex(item => (item.id || item.productId) === (itemToAdd.id || itemToAdd.productId));

        if (existingItemIndex > -1) {
             // Item exists, update quantity
             console.log("Item exists, updating quantity");
            return prevCart.map((item, index) =>
                 index === existingItemIndex
                     ? { ...item, quantity: (item.quantity || 1) + (itemToAdd.quantity || 1) }
                     : item
             );
        } else {
             // Item does not exist, add it with quantity
             console.log("Item does not exist, adding new item");
             // Ensure sellerId is included!
             if (!itemToAdd.sellerId) {
                 console.error("CRITICAL: Attempted to add item without sellerId!", itemToAdd);
                 // Optionally throw error or handle gracefully
                 alert("Error: Cannot add item without seller information.");
                 return prevCart; // Return previous cart without adding
             }
             return [...prevCart, { ...itemToAdd, quantity: itemToAdd.quantity || 1 }];
        }
    });
};

  const removeFromCart = (id) => {
     console.log("Removing item with id:", id);
    // Use the same ID property consistently ('id' or 'productId')
    setCart((prev) => prev.filter((item) => (item.id || item.productId) !== id));
  };

  // --- 1. DEFINE THE clearCart FUNCTION ---
  const clearCart = () => {
    if (email) { // Only clear storage if associated with a user
        console.log(`Clearing cart for user: ${email}`);
        localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}${email}`);
    } else {
        console.log("Clearing cart state (no user email provided).");
    }
    setCart([]); // Always clear the state
  };
  // --- End Definition ---


  // --- 2. INCLUDE clearCart IN THE CONTEXT VALUE ---
  const contextValue = {
    cart,
    addToCart,
    removeFromCart,
    clearCart // <-- Add clearCart here
  };
  // --- End Value Update ---

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};