"use client";

import { useState } from "react";

export function useCart() {
    const [cart, setCart] = useState<{ [key: string]: any }>({});

    const addToCart = (item: any, selectedSize?: string, selectedColor?: string) => {
        setCart((prevCart) => {
        const cartKey = `${item.id || item.name}-${selectedSize || "U"}-${selectedColor || "U"}`;
        const existingItem = prevCart[cartKey];

        return {
            ...prevCart,
            [cartKey]: {
            ...item,
            cartKey,
            quantity: (existingItem?.quantity || 0) + 1,
            selectedSize,
            selectedColor,
            },
        };
        });
    };

    const removeFromCart = (cartKey: string) => {
        setCart((prevCart) => {
        const existingItem = prevCart[cartKey];
        if (!existingItem) return prevCart;

        const newCart = { ...prevCart };
        if (existingItem.quantity === 1) {
            delete newCart[cartKey];
        } else {
            newCart[cartKey] = {
            ...existingItem,
            quantity: existingItem.quantity - 1,
            };
        }
        return newCart;
        });
    };

    const cartValues = Object.values(cart);
    const totalItems = cartValues.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = cartValues.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return {
        cart,
        addToCart,
        removeFromCart,
        totalItems,
        subtotal,
    };
}