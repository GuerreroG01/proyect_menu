"use client";

import { useState } from "react";

export function useCart() {
    const [cart, setCart] = useState<{ [key: string]: any }>({});

    const addToCart = (item: any) => {
        setCart((prev) => ({
        ...prev,
        [item.name]: {
            name: item.name,
            price: item.price,
            quantity: (prev[item.name]?.quantity || 0) + 1,
        },
        }));
    };

    const removeFromCart = (name: string) => {
        setCart((prev) => {
        const existing = prev[name];
        if (!existing) return prev;

        if (existing.quantity === 1) {
            const { [name]: _, ...rest } = prev;
            return rest;
        }

        return {
            ...prev,
            [name]: { ...existing, quantity: existing.quantity - 1 },
        };
        });
    };

    const totalItems = Object.values(cart).reduce((a: any, b: any) => a + b.quantity, 0);

    const subtotal = Object.values(cart).reduce(
        (a: any, b: any) => a + b.price * b.quantity,
        0
    );

    return {
        cart,
        addToCart,
        removeFromCart,
        totalItems,
        subtotal,
    };
}