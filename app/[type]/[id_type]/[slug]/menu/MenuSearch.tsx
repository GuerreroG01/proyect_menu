"use client";

import { Search, X } from "lucide-react";

export default function MenuSearch({ value, onChange, onClear }: any) {
    return (
        <div className="relative flex items-center">
            <Search className="absolute left-4 text-slate-400" size={18} />

            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Busca tu plato favorito..."
                className="w-full bg-slate-100 border-none rounded-[1.5rem] py-3.5 pl-12 pr-12 text-sm text-slate-900 caret-[#00A7E1] placeholder:text-slate-400 focus:ring-2 focus:ring-[#00A7E1]/20 outline-none transition-all"
            />

            {value && (
                <button
                onClick={onClear}
                className="absolute right-4 p-1 bg-slate-200/60 hover:bg-slate-200 text-slate-500 rounded-full transition-colors active:scale-90"
                >
                <X size={14} />
                </button>
            )}
        </div>
    );
}