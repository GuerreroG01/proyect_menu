"use client";

import { useEffect, useState } from "react";

export function useCategory(folder: string, slug: string, categoryId: string) {
    const [category, setCategory] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!categoryId) return;

        const load = async () => {
            try {
                setLoading(true);

                const basePath = `/${folder}/${slug}/categorias/${categoryId}`;

                const metaRes = await fetch(`${basePath}/meta.json`);

                if (!metaRes.ok) {
                    setCategory(null);
                    return;
                }

                const meta = await metaRes.json();

                const pageRes = await fetch(`${basePath}/page_1.json`);

                let items = [];

                if (pageRes.ok) {
                    const raw = await pageRes.json();
                    items = Array.isArray(raw) ? raw : raw?.items ?? raw?.data ?? [];
                }

                setCategory({
                    ...meta,
                    items,
                });

            } catch (err) {
                console.error("useCategory error:", err);
                setCategory(null);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [folder, slug, categoryId]);

    return { category, loading };
}