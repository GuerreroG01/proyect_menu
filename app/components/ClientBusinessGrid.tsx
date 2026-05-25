"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "./Loading";

type Negocio = {
    id?: string | number;
    id_type?: string | number;
    slug?: string;
    type?: string;
    name?: string;
    category?: string;
    icon?: string;
};

export default function ClientBusinessGrid({ negocios }: { negocios: Negocio[]; }) {
    const router = useRouter();
    const [loadingId, setLoadingId] = useState<string | number | null>(null);

    const handleRedirect = (n: Negocio) => {
        if (!(n.type && n.id_type && n.slug)) return;

        setLoadingId(n.id || n.id_type);

        setTimeout(() => {
        router.push(`/${n.type}/${n.id_type}/${n.slug}`);
        }, 450);
    };

    return (
        <section className="mt-28">
        <div className="flex items-end justify-between mb-10">
            <h2 className="text-3xl font-black text-[#002B5B]">
            Negocios de demostración
            </h2>

            <a
            href="/catalogo"
            className="text-[#00A7E1] font-bold hover:underline"
            >
            Ver catálogo completo →
            </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {negocios.slice(0, 3).map((n) => {
            const isLoading = loadingId === (n.id || n.id_type);
            const isAnyLoading = loadingId !== null;

            return (
                <button
                key={n.id_type || n.id}
                onClick={() => handleRedirect(n)}
                disabled={isAnyLoading}
                className={`
                    relative text-left bg-white border border-slate-100 rounded-2xl p-6
                    transition-all duration-300 overflow-hidden
                    hover:shadow-lg hover:-translate-y-1

                    ${isAnyLoading && !isLoading ? "opacity-40" : ""}
                `}
                >
                {/* contenido */}
                <div className={`${isLoading ? "opacity-20 scale-95" : ""} transition-all duration-300`}>
                    <div className="text-3xl mb-3">{n.icon}</div>

                    <h3 className="font-bold text-[#002B5B]">{n.name}</h3>

                    <p className="text-slate-400 text-sm">{n.category}</p>
                </div>

                {isLoading && (
                    <Loading message="Abriendo negocio..." />
                )}
                </button>
            );
            })}
        </div>
        </section>
    );
}