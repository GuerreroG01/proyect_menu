"use client";

import { ArrowLeft, Coffee } from "lucide-react";

export default function BakeryHeader({ data, router }: any) {
    return (
        <header className="bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-[#F2D6B3]">
            <div className="max-w-2xl mx-auto px-5 py-4">

                <div className="flex items-center justify-between mb-4">

                <button
                    onClick={() => router.back()}
                    className="p-2.5 bg-[#FFF3E6] hover:bg-[#F2D6B3] rounded-2xl"
                >
                    <ArrowLeft size={20} className="text-[#3A2E2A]" />
                </button>

                <div className="text-center">
                    <span className="text-[9px] font-black text-[#C97B2A] uppercase tracking-[0.3em]">
                    Panadería artesanal
                    </span>
                    <h1 className="text-xl font-black text-[#3A2E2A] uppercase">
                    {data.name}
                    </h1>
                </div>

                <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center border overflow-hidden">
                    {data.logo ? (
                    <img src={data.logo} className="w-full h-full object-cover" />
                    ) : (
                    <Coffee size={18} className="text-[#C97B2A]" />
                    )}
                </div>

                </div>
            </div>
        </header>
    );
}