import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const LOCAL_STORAGE_KEY_PREFIX = "cart_";

// Load cart from localStorage for a specific user
const loadCartFromStorage = (email) => {
  try {
    const storedCart = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${email}`);
    return storedCart ? JSON.parse(storedCart) : [];
  } catch {
    return [];
  }
};

// Save cart to localStorage for a specific user
const saveCartToStorage = (email, cart) => {
  localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${email}`, JSON.stringify(cart));
};

export const CartProvider = ({ children, email }) => {
  const [cart, setCart] = useState([]);

  // Load cart when user logs in or email changes
  useEffect(() => {
    if (email) {
      const storedCart = loadCartFromStorage(email);
      setCart(storedCart);
    }
  }, [email]);

  // Sync cart to localStorage
  useEffect(() => {
    if (email) {
      saveCartToStorage(email, cart);
    }
  }, [cart, email]);

  const addToCart = (item) => {
    setCart((prev) => {
      const exists = prev.some((p) => p.id === item.id);
      if (exists) return prev;
      return [...prev, item];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
