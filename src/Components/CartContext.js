import React, { createContext, useContext, useState, useEffect } from 'react';  

const CartContext = createContext();  

export const CartProvider = ({ children }) => {  
    const [cart, setCart] = useState(() => {  
        const savedCart = localStorage.getItem('cart');  
        return savedCart ? JSON.parse(savedCart) : [];  
    });  

    useEffect(() => {  
        localStorage.setItem('cart', JSON.stringify(cart));  
    }, [cart]);  

    const addToCart = (item) => {  
        setCart((prevCart) => [...prevCart, item]);  
    };  

    const removeFromCart = (itemId) => {  
        setCart((prevCart) => prevCart.filter(item => item.id !== itemId));  
    };  

    const clearCart = () => {  
        setCart([]);  
    };  

    const getTotalItems = () => {  
        return cart.length;  
    };  

    return (  
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getTotalItems }}>  
            {children}  
        </CartContext.Provider>  
    );  
};  

export const useCart = () => {  
    return useContext(CartContext);  
};  