"use client";

import { ArrowLeft, Utensils } from "lucide-react";
import MenuSearch from "./MenuSearch";
import MenuCategories from "./MenuCategories";

export default function MenuHeader({
  name,
  logo,
  categories,
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  searchLoading,
  router,
  setCurrentPage
}: any) {
    return (
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">

        <div className="max-w-2xl mx-auto px-5 py-4">

            <div className="flex items-center justify-between mb-4">

            <button
                onClick={() => router.back()}
                className="p-2.5 bg-white hover:bg-slate-100 rounded-2xl border border-slate-200 text-slate-800"
            >
                <ArrowLeft size={20} />
            </button>

            <div className="text-center">
                <span className="text-[9px] font-black text-[#00A7E1] uppercase tracking-[0.3em]">
                Menú Digital
                </span>

                <h1 className="text-xl font-black text-[#002B5B] uppercase">
                {name}
                </h1>
            </div>

            <div className="w-10 h-10 rounded-2xl overflow-hidden">
                {logo ? (
                <img src={logo} alt={name} />
                ) : (
                <Utensils size={18} />
                )}
            </div>
            </div>

            <MenuSearch
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery("")}
            loading={searchLoading}
            />
        </div>

        {!searchQuery && (
            <MenuCategories
                categories={categories}
                active={activeCategory}
                setActive={setActiveCategory}
                setCurrentPage={setCurrentPage}
            />
        )}
        </header>
    );
}