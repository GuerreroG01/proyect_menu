"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowRight,
    ArrowLeft,
    LayoutGrid,
    Croissant,
    UtensilsCrossed,
} from "lucide-react";

const ICON_MAP: Record<
    string,
    React.ComponentType<{ className?: string; size?: number }>
> = {
    menus: UtensilsCrossed,
    restaurant: UtensilsCrossed,
    bakery: Croissant,
};

export default function CatalogoClient({ negocios = [] }: any) {
    const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] bg-slate-50 flex flex-col text-slate-900 antialiased">

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 w-full">

                <div className="relative flex flex-col md:flex-row md:items-center md:justify-between mb-16 pb-8 border-b border-slate-200/80 gap-6">

                <button
                    onClick={() => router.back()}
                    className="group inline-flex items-center gap-3 px-4 py-2 rounded-2xl
                            bg-white/80 backdrop-blur-md
                            border border-slate-200/60
                            shadow-[0_4px_14px_-4px_rgba(0,0,0,0.1)]
                            hover:shadow-[0_12px_30px_-10px_rgba(0,167,225,0.25)]
                            hover:border-[#00A7E1]/40
                            transition-all duration-300
                            active:scale-[0.98]"
                >
                    <div className="relative w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 group-hover:bg-[#002B5B] transition-all duration-300">
                    <ArrowLeft
                        size={16}
                        className="text-slate-500 group-hover:text-white transition-colors"
                    />
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 bg-[#00A7E1]/10 blur-md transition-all" />
                    </div>

                    <span className="text-sm font-semibold text-slate-600 group-hover:text-[#002B5B] transition-colors">
                        Volver
                    </span>
                </button>

                <div>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#002B5B]">
                    Catálogo de{" "}
                    <span className="bg-gradient-to-r from-[#002B5B] via-[#00A7E1] to-[#002B5B] bg-clip-text text-transparent">
                        Negocios
                    </span>
                    </h1>
                </div>

                <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-200/60 self-start md:self-auto">
                    <div className="bg-[#002B5B] text-white font-bold px-3 py-1.5 rounded-xl text-sm">
                    {negocios.length}
                    </div>
                    <span className="text-sm font-semibold text-slate-600 pr-3">
                    {negocios.length === 1 ? "Lugar disponible" : "Lugares listados"}
                    </span>
                </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {negocios.map((res: any) => {
                        const isMenu =
                        res.type === "menus" || res.type === "restaurant";

                        const Icon = ICON_MAP[res.type] || LayoutGrid;

                        const href = `/${res.type}/${res.id_type || res.id}/${res.slug}`;
                        const isLoading = loadingSlug === res.slug;

                        return (
                        <Link
                            key={`${res.type}-${res.id || res.slug}`}
                            href={href}
                            onClick={() => setLoadingSlug(res.slug)}
                            className="group relative bg-white border border-slate-200/60 rounded-3xl p-6 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(0,167,225,0.15)] hover:border-[#00A7E1]/40 hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between overflow-hidden"
                        >
                            {/* hover gradient */}
                            <div className="absolute inset-0 bg-gradient-to-b from-[#00A7E1]/0 to-[#00A7E1]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                            {/* loading */}
                            {isLoading && (
                            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-3xl">
                                <div className="flex flex-col items-center gap-3">
                                <div className="relative w-12 h-12">
                                    <div className="absolute inset-0 rounded-full border border-[#00A7E1]/20" />
                                    <div className="absolute inset-0 rounded-full border-t-2 border-[#00A7E1] border-r-[#002B5B] animate-spin" />
                                    <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[#002B5B] to-[#00A7E1] animate-pulse" />
                                </div>
                                <p className="text-xs font-semibold text-[#002B5B] animate-pulse">
                                    Cargando...
                                </p>
                                </div>
                            </div>
                            )}

                            {/* content */}
                            <div>
                            <div className="flex items-start justify-between mb-6 relative z-10">
                                <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-white group-hover:border-[#00A7E1]/20 transition-all duration-500 text-slate-600 group-hover:text-[#00A7E1]">
                                <Icon size={28} />
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                <span
                                    className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                    isMenu
                                        ? "text-amber-700 bg-amber-50"
                                        : "text-indigo-700 bg-indigo-50"
                                    }`}
                                >
                                    {isMenu ? (
                                    <UtensilsCrossed size={10} />
                                    ) : (
                                    <Croissant size={10} />
                                    )}
                                    {isMenu ? "Menú" : "Catálogo"}
                                </span>
                                </div>
                            </div>

                            <h2 className="text-xl font-extrabold text-[#002B5B] tracking-tight group-hover:text-[#00A7E1] transition-colors duration-300 line-clamp-1 mb-2">
                                {res.name}
                            </h2>
                            </div>

                            {/* footer */}
                            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between relative z-10">
                            <span className="text-sm text-slate-400 font-bold group-hover:text-[#002B5B] transition-colors duration-300">
                                Explorar ahora
                            </span>

                            <div className="bg-slate-50 group-hover:bg-[#002B5B] text-slate-400 group-hover:text-white p-3 rounded-2xl border border-slate-100 group-hover:border-transparent transition-all duration-500 group-hover:translate-x-1 shadow-sm group-hover:shadow-md">
                                <ArrowRight size={16} strokeWidth={2.5} />
                            </div>
                            </div>
                        </Link>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}