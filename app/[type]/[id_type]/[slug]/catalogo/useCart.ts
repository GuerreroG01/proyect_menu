"use client";

import { useState } from "react";

export function useCart() {
    const [cart, setCart] = useState<Record<string, any>>({});

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
            const item = prev[name];
            if (!item) return prev;

            if (item.quantity === 1) {
                const { [name]: _, ...rest } = prev;
                return rest;
            }

            return {
                ...prev,
                [name]: { ...item, quantity: item.quantity - 1 },
            };
        });
    };

    return { cart, addToCart, removeFromCart };
}