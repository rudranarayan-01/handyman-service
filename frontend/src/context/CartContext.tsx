import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    // 1. Initial State LocalStorage se uthao taaki refresh par data na jaye
    const [cartItems, setCartItems] = useState<any[]>(() => {
        const savedCart = localStorage.getItem('Homexpertz_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // 2. Jab bhi cart change ho, LocalStorage update karo
    useEffect(() => {
        localStorage.setItem('Homexpertz_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (service: any) => {
        setCartItems((prev) => {
            // Check if already exists using _id (MongoDB style)
            const exists = prev.find(item => item._id === service._id);
            if (exists) return prev;
            return [...prev, service];
        });
    };

    const removeFromCart = (id: string) => {
        // FIXED: _id use kar rahe hain delete ke liye
        setCartItems((prev) => prev.filter(item => item._id !== id));
    };

    const clearCart = () => {
    setCartItems([]); // Reset the array to empty
};

    const totalAmount = cartItems.reduce((acc, item) => acc + (item.price || 0), 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, totalAmount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);