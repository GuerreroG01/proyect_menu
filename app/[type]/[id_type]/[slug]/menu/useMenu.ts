"use client";

import { useEffect, useState } from "react";

export function useMenu(folder: string, slug: string) {
    const [data, setData] = useState<any>(null);
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

                const items = Array.isArray(raw) ? raw : raw?.items || [];

                return { id: cat.id, name: cat.name, items };
                } catch {
                return { id: cat.id, name: cat.name, items: [] };
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