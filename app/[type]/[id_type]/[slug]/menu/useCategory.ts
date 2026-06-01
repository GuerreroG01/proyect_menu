"use client";

import { useEffect, useState } from "react";

export function useCategory(folder: string, slug: string, categoryId: string, page: number = 1) {
    const [category, setCategory] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!categoryId) return;

        const load = async () => {
            if (!categoryId) return;
            if (page < 1) return;

            try {
                setLoading(true);

                const basePath = `/${folder}/${slug}/categorias/${categoryId}`;

                const metaRes = await fetch(`${basePath}/meta.json`);

                if (!metaRes.ok) {
                    setCategory(null);
                    return;
                }

                const meta = await metaRes.json();

                const pageRes = await fetch(`${basePath}/page_${page}.json`);

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
    }, [folder, slug, categoryId, page]);

    return { category, loading };
}