"use client";

import { Search, X } from "lucide-react";

export default function BakerySearch({
    searchQuery,
    setSearchQuery,
}: any) {
    return (
        <div className="px-5 py-4 max-w-2xl mx-auto w-full">
            <div className="relative group">
                <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B5E3C] transition-colors group-focus-within:text-[#6B3F22]"
                    size={18}
                />

                <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Busca tu pan o dulce..."
                    className="
                        w-full
                        bg-[#FFF3E6]
                        rounded-2xl
                        py-3.5
                        pl-11 pr-10
                        text-sm text-[#3A2E2A]
                        placeholder:text-[#8B5E3C]/70
                        outline-none
                        border border-transparent
                        shadow-sm
                        transition-all duration-200
                        focus:border-[#C08A5A]
                        focus:ring-2 focus:ring-[#C08A5A]/30
                        focus:shadow-md
                    "
                />

                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery("")}
                        className="
                            absolute right-3 top-1/2 -translate-y-1/2
                            p-1 rounded-full
                            text-[#8B5E3C]
                            hover:bg-[#EAD3BC]
                            transition
                        "
                    >
                        <X size={14} />
                    </button>
                )}
            </div>
        </div>
    );
}