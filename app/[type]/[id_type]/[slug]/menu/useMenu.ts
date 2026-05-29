"use client";

import { useEffect, useState } from "react";

export function useMenu(folder: string, slug: string) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch(`/${folder}/${slug}/info.json`);
                if (!res.ok) {
                    setData(null);
                    return;
                }

                const json = await res.json();
                setData(json);

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