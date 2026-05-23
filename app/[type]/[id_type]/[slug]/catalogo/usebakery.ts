"use client";

import { useEffect, useState } from "react";

type MenuItem = {
    name: string;
    description?: string;
    price: number;
    image?: string;
};

type Category = {
    name: string;
    items: MenuItem[];
};

type Menu = {
    name: string;
    whatsapp: string;
    logo?: string;
    delivery: number;
    categories: Category[];
};

export function useBakery(folder: string, slug: string) {
    const [data, setData] = useState<Menu | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
        try {
            const res = await fetch(`/${folder}/${slug}/info.json`);
            if (!res.ok) return setData(null);

            const json = await res.json();

            const normalizedCategories = await Promise.all(
                json.categories.map(async (cat: any) => {
                    try {
                    const res = await fetch(cat.file);
                    const raw = await res.json();

                    return {
                        name: cat.name,
                        items: Array.isArray(raw) ? raw : raw?.items || [],
                    };
                    } catch {
                    return { name: cat.name, items: [] };
                    }
                })
            );

            setData({ ...json, categories: normalizedCategories });
        } catch {
            setData(null);
        } finally {
            setLoading(false);
        }
        };

        load();
    }, [folder, slug]);

    return { data, loading };
}