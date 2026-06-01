"use client";

export default function MenuCategories({ categories, active, setActive, setCurrentPage }: any) {
    return (
        <nav className="flex gap-3 overflow-x-auto px-5 pb-4 no-scrollbar">
        {categories.map((cat: any) => (
            <button
            key={cat.id}
            onClick={() => {
                setActive(cat.id);
                setCurrentPage(1);
            }}
            className={`px-6 py-2.5 rounded-[1.2rem] text-xs font-bold transition-all ${
                active === cat.id
                ? "bg-[#00A7E1] text-white shadow-lg shadow-blue-100 scale-105"
                : "bg-white text-slate-400 border border-slate-100 hover:bg-slate-50"
            }`}
            >
            {cat.name}
            </button>
        ))}
        </nav>
    );
}