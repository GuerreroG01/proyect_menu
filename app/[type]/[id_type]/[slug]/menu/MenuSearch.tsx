"use client";

import { Search, X } from "lucide-react";

export default function MenuSearch({
    value,
    onChange,
    onClear,
    loading,
}: any) {
    console.log('El valor del loading es: ', loading);
    return (
        <div className="relative flex items-center">

        <div className="absolute left-4 flex items-center justify-center w-5 h-5">

            <Search
                className={`text-slate-400 transition-opacity duration-200 ${
                loading && value ? "opacity-0" : "opacity-100"
                }`}
                size={18}
            />

            {loading && value && (
                <div className="absolute w-4 h-4 border-2 border-slate-300 border-t-[#00A7E1] rounded-full animate-spin" />
            )}
            </div>

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