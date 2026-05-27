"use client";

import { useState, useRef, useEffect } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface Category {
    id: string;
    name: string;
}

type GenderType = "todos" | "caballero" | "dama";

interface HeaderProps {
    name: string;
    logo: string;
    categories: Category[];
    activeCategory: number;
    setActiveCategory: (index: number) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    router: AppRouterInstance;
    gender: GenderType;               // Recibido del padre
    setGender: (type: GenderType) => void; // Recibido del padre
}

export default function StoreHeader({
    name,
    logo,
    categories,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    router,
    gender,
    setGender,
}: HeaderProps) {
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [isGenderMenuOpen, setIsGenderMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsGenderMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const genderLabels: Record<GenderType, string> = {
        todos: "Todos",
        caballero: "Caballero",
        dama: "Dama"
    };

    return (
        <header className="bg-white/95 border-b border-slate-100 sticky top-0 z-40 backdrop-blur-md transition-all duration-300">
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
                
                <div className="flex items-center justify-between h-16 md:h-20 gap-4 md:gap-8">
                    
                    <div className="flex items-center gap-3 shrink-0">

                        <button
                            onClick={() => router.back()}
                            className="p-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-all duration-200"
                        >
                            <svg
                                className="w-5 h-5 text-slate-700"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>

                        {/* Logo */}
                        <div 
                            onClick={() => router.push("/")}
                            className={`items-center gap-3 cursor-pointer select-none transition-all duration-200 ${
                                isMobileSearchOpen ? "hidden md:flex" : "flex"
                            }`}
                        >
                            <img 
                                src={logo} 
                                alt={name} 
                                className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-slate-50 object-cover ring-1 ring-slate-200/60 p-0.5" 
                            />

                            <div className="hidden sm:block">
                                <h1 className="font-black text-slate-900 text-sm md:text-base tracking-widest uppercase font-mono leading-none">
                                    {name}
                                </h1>

                                <p className="text-[9px] text-emerald-600 flex items-center gap-1 font-bold tracking-wider uppercase mt-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                                    Tienda En Linea
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className={`flex-1 transition-all duration-300 ${
                        isMobileSearchOpen ? "flex" : "hidden md:flex"
                    } max-w-md lg:max-w-xl mx-auto relative`}>
                        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar prendas, calzado, accesorios..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-50/70 border border-slate-200/60 rounded-full py-2 pl-10 pr-10 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition-all duration-200 shadow-inner"
                        />
                        
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-slate-200/50 rounded-full w-5 h-5 flex items-center justify-center transition-colors"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    <div className={`items-center gap-2 sm:gap-3 shrink-0 ${isMobileSearchOpen ? "hidden md:flex" : "flex"}`}>
                        
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsGenderMenuOpen(!isGenderMenuOpen)}
                                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-white hover:border-slate-900 transition-all duration-200 select-none"
                            >
                                {gender === "todos" && (
                                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                )}
                                {gender === "caballero" && (
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 11.518 1.34l-.041.02a.75.75 0 11-.518-1.34zM12 6a9 9 0 100 18 9 9 0 000-18z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 14.25L12 18m0 0l-3.75-3.75M12 18V6" />
                                    </svg>
                                )}
                                {gender === "dama" && (
                                    <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a5 5 0 100-10 5 5 0 000 10zM12 12v9m-3-3h6" />
                                    </svg>
                                )}
                                <span className="text-xs font-bold tracking-widest uppercase text-slate-800">
                                    {genderLabels[gender]}
                                </span>
                                <svg className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isGenderMenuOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {isGenderMenuOpen && (
                                <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-100 rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                    {(["todos", "caballero", "dama"] as GenderType[]).map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => {
                                                setGender(type);
                                                setIsGenderMenuOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 text-xs font-semibold tracking-widest uppercase transition-colors flex items-center justify-between ${
                                                gender === type 
                                                    ? "text-slate-950 bg-slate-50 font-bold" 
                                                    : "text-slate-500 hover:text-slate-950 hover:bg-slate-50/60"
                                            }`}
                                        >
                                            {genderLabels[type]}
                                            {gender === type && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-950"></span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="h-5 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>

                        <button 
                            onClick={() => setIsMobileSearchOpen(true)}
                            className="p-2 text-slate-700 hover:text-black hover:bg-slate-50 rounded-full transition-colors md:hidden"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>

                    {isMobileSearchOpen && (
                        <button
                            onClick={() => setIsMobileSearchOpen(false)}
                            className="p-2 text-slate-500 hover:text-slate-800 md:hidden shrink-0"
                        >
                            <span className="text-xs font-bold tracking-wider uppercase">Cancelar</span>
                        </button>
                    )}

                </div>
                {categories && categories.length > 0 && (
                    <nav className={`transition-all duration-200 gap-1.5 overflow-x-auto pb-3 pt-1 justify-start md:justify-center border-t border-slate-100/70 ${
                        isMobileSearchOpen ? "hidden md:flex" : "flex"
                    } 
                    [&::-webkit-scrollbar]:h-1 
                    [&::-webkit-scrollbar-track]:bg-slate-50 
                    [&::-webkit-scrollbar-thumb]:bg-slate-200 
                    [&::-webkit-scrollbar-thumb]:rounded-full 
                    [scrollbar-width:thin] 
                    [scrollbar-color:#E2E8F0_#F8FAFC]`}>
                        {categories.map((category, index) => {
                            const isActive = activeCategory === index;
                            return (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveCategory(index)}
                                    className={`text-xs md:text-[13px] px-4 py-2 font-medium tracking-widest uppercase transition-all duration-200 whitespace-nowrap relative group ${
                                        isActive
                                            ? "text-slate-950 font-bold"
                                            : "text-slate-500 hover:text-slate-950"
                                    }`}
                                >
                                    {category.name}
                                    <span className={`absolute bottom-0 left-4 right-4 h-[2px] bg-slate-950 transition-transform duration-300 ${
                                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"
                                    }`} />
                                </button>
                            );
                        })}
                    </nav>
                )}

            </div>
        </header>
    );
}