// src/Components/CartContext.js

import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === null) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

const LOCAL_STORAGE_KEY_PREFIX = "cart_";

const loadCartFromStorage = (email) => {
    try {
        if (!email) return [];
        const storedCart = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${email}`);
        return storedCart ? JSON.parse(storedCart) : [];
    } catch {
        console.error("Failed to parse cart from localStorage");
        return [];
    }
};

const saveCartFromStorage = (email, cart) => {
    if (!email) return;
    try {
        localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${email}`, JSON.stringify(cart));
    } catch {
        console.error("Failed to save cart to localStorage");
    }
};

export const CartProvider = ({ children, email }) => {
    const [cart, setCart] = useState(() => loadCartFromStorage(email));

    useEffect(() => {
        if (email) {
            const storedCart = loadCartFromStorage(email);
            setCart(storedCart);
            console.log(`Cart loaded for user: ${email}`, storedCart);
        } else {
            setCart([]);
            console.log("User logged out or email cleared, cart state cleared.");
        }
    }, [email]);

    useEffect(() => {
        if (email) {
            saveCartFromStorage(email, cart);
            console.log(`Cart saved for user: ${email}`, cart);
        }
    }, [cart, email]);

    const addToCart = (itemToAdd) => {
        setCart((prevCart) => {
            console.log("Adding item:", itemToAdd);
            const existingItemIndex = prevCart.findIndex(item => (item.id || item.productId) === (itemToAdd.id || itemToAdd.productId));

            if (existingItemIndex > -1) {
                console.log("Item already in cart, not adding again");
                return prevCart; //dont add again
            } else {
                console.log("Item does not exist, adding new item");
                if (!itemToAdd.sellerId) {
                    console.error("CRITICAL: Attempted to add item without sellerId!", itemToAdd);
                    alert("Error: Cannot add item without seller information.");
                    return prevCart;
                }
                return [...prevCart, itemToAdd];
            }
        });
    };

    const removeFromCart = (id) => {
        console.log("Removing item with id:", id);
        setCart((prev) => prev.filter((item) => (item.id || item.productId) !== id));
    };

    const clearCart = () => {
        if (email) {
            console.log(`Clearing cart for user: ${email}`);
            localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}${email}`);
        } else {
            console.log("Clearing cart state (no user email provided).");
        }
        setCart([]);
    };

    const contextValue = {
        cart,
        addToCart,
        removeFromCart,
        clearCart
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};