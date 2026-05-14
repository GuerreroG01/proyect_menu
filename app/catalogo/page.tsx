import Link from "next/link";
import { ArrowRight, LayoutGrid, Globe } from "lucide-react";
import fs from "fs";
import path from "path";

const formatName = (id: string) => {
    return id
        .replace(/_/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

export default function CatalogoPage() {
  const menusDirectory = path.join(process.cwd(), "public", "menus");
  let restaurants: any[] = [];

    try {
        const files = fs.readdirSync(menusDirectory);

        restaurants = files
        .filter((file) => file.endsWith(".json"))
        .map((file) => {
            const id = file.replace(".json", "");

            return {
            id,
            name: formatName(id),
            icon: "🍽️",
            category: "Restaurante Digital",
            status: "Online",
            };
        });
    } catch (error) {
        console.error("Error leyendo menús:", error);
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">

            <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">

                        <div className="bg-[#002B5B] p-2.5 rounded-xl">
                        <Globe className="text-[#00A7E1]" size={20} />
                        </div>

                        <div>
                        <h1 className="font-black text-[#002B5B] text-xl">
                            Catálogo de Restaurantes
                        </h1>

                        <p className="text-sm text-slate-400">
                            Explora negocios disponibles en la plataforma
                        </p>
                        </div>

                    </div>

                    <div className="text-sm font-bold text-slate-500">
                        {restaurants.length} activos
                    </div>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-6 py-12">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                {restaurants.map((res) => (
                    <Link
                    key={res.id}
                    href={`/${res.id}`}
                    className="group bg-white border border-slate-100 rounded-[2rem] p-8 hover:shadow-xl hover:border-[#00A7E1]/30 transition-all duration-300"
                    >

                    <div className="flex items-center justify-between mb-6">

                        <div className="text-4xl">{res.icon}</div>

                        <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        {res.status}
                        </span>

                    </div>

                    <h2 className="text-xl font-black text-[#002B5B] group-hover:text-[#00A7E1] transition">
                        {res.name}
                    </h2>

                    <p className="text-slate-400 text-sm mt-2 flex items-center gap-2">
                        <LayoutGrid size={14} />
                        {res.category}
                    </p>

                    <div className="mt-8 flex items-center justify-between">

                        <span className="text-xs text-slate-400 font-medium">
                        Ver menú digital
                        </span>

                        <div className="bg-[#002B5B] group-hover:bg-[#00A7E1] text-white p-3 rounded-xl transition-all duration-300 group-hover:translate-x-1">
                        <ArrowRight size={18} />
                        </div>

                    </div>

                    </Link>
                ))}
                </div>
            </main>
        </div>
    );
}