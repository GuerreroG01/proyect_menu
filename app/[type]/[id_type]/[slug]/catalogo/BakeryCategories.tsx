"use client";

export default function BakeryCategories({
  categories,
  active,
  setActive,
}: any) {

  return (
    <nav className="flex gap-3 overflow-x-auto px-5 pb-4">

      {categories.map((cat: any) => (

        <button
          key={cat.id}
          onClick={() => setActive(cat.id)}
          className={`px-6 py-2 rounded-[1.2rem] text-xs font-bold whitespace-nowrap ${
            active === cat.id
              ? "bg-[#C97B2A] text-white"
              : "bg-[#FFF3E6] text-[#8B5E3C]"
          }`}
        >
          {cat.name}
        </button>

      ))}

    </nav>
  );
}