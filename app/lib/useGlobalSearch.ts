"use client";

import { useEffect, useState } from "react";

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function useGlobalSearch(
  folder: string,
  slug: string,
  query: string
) {
  console.log("useGlobalSearch folder:", folder);
  console.log("useGlobalSearch slug:", slug);
  console.log("useGlobalSearch query:", query);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    const load = async () => {
      try {
        setLoading(true);

        const metaRes = await fetch(
          `/${folder}/${slug}/search/meta.json`,
          { signal: controller.signal }
        );

        if (!metaRes.ok) return;

        const meta = await metaRes.json();

        const foundProducts: any[] = [];

        for (let page = 1; page <= meta.total_pages; page++) {
          const indexRes = await fetch(
            `/${folder}/${slug}/search/index_${page}.json`,
            { signal: controller.signal }
          );

          if (!indexRes.ok) continue;

          const indexData = await indexRes.json();

          const matches = indexData.filter((item: any) =>
            normalize(item.name).includes(normalize(query))
          );

          for (const match of matches) {
            try {
              const fileRes = await fetch(match.file, {
                signal: controller.signal,
              });

              if (!fileRes.ok) continue;

              const json = await fileRes.json();

              const items = Array.isArray(json)
                ? json
                : json.items || [];

              const product = items[match.index];

              if (product) {
                foundProducts.push(product);
              }
            } catch {}
          }
        }

        setResults(foundProducts);
      } catch (err) {
        if ((err as any).name !== "AbortError") {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    load();

    return () => controller.abort();
  }, [folder, slug, query]);

  return {
    results,
    loading,
  };
}
