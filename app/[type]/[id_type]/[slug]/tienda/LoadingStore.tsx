"use client";

export default function LoadingStore() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col animate-pulse">
        <div className="bg-white border-b border-slate-100 p-4 flex flex-col gap-4">
            <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-200"></div>
            <div className="flex flex-col gap-2">
                <div className="w-32 h-4 bg-slate-200 rounded"></div>
                <div className="w-20 h-3 bg-slate-200 rounded"></div>
            </div>
            </div>
            <div className="w-full h-10 bg-slate-200 rounded-xl"></div>
        </div>

        {/* Esqueleto del Contenido */}
        <main className="p-5 max-w-2xl mx-auto w-full flex-1 grid gap-6">
            <div className="w-24 h-4 bg-slate-200 rounded"></div>
            
            {/* Simulamos 3 tarjetas de producto */}
            {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl p-4 border border-slate-100 flex gap-4">
                <div className="w-24 h-32 bg-slate-200 rounded-xl flex-shrink-0"></div>
                <div className="flex-1 flex flex-col gap-3">
                <div className="w-3/4 h-5 bg-slate-200 rounded"></div>
                <div className="w-full h-3 bg-slate-200 rounded"></div>
                <div className="w-1/2 h-3 bg-slate-200 rounded"></div>
                <div className="flex justify-between items-center mt-auto">
                    <div className="w-16 h-6 bg-slate-200 rounded"></div>
                    <div className="w-20 h-8 bg-slate-200 rounded-full"></div>
                </div>
                </div>
            </div>
            ))}
        </main>
        </div>
    );
}