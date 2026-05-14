import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type MenuItem = {
    name: string;
    description?: string;
    price: number;
};

type Category = {
    name: string;
    items: MenuItem[];
};

type Menu = {
    name: string;
    whatsapp: string;
    categories: Category[];
};

export default function RestaurantPage() {
    const router = useRouter();
    const { restaurant } = router.query;

    const [data, setData] = useState<Menu | null>(null);

    useEffect(() => {
        if (!restaurant || Array.isArray(restaurant)) return;

        fetch(`/menus/${restaurant}.json`)
        .then(res => res.json())
        .then(setData)
        .catch(err => console.error("Error cargando menú:", err));
    }, [restaurant]);

    if (!data) return <p>Cargando...</p>;

    return (
        <div className="p-4 max-w-2xl mx-auto">

        <h1 className="text-2xl font-bold">
            {data.name}
        </h1>

        {data.categories.map((cat, i) => (
            <div key={i} className="mt-6">

            <h2 className="text-xl font-semibold">
                {cat.name}
            </h2>

            {cat.items.map((item, j) => (
                <div key={j} className="border p-3 rounded mt-2">

                <p className="font-bold">
                    {item.name}
                </p>

                {item.description && (
                    <p>{item.description}</p>
                )}

                <p className="text-green-600">
                    ${item.price}
                </p>

                </div>
            ))}

            </div>
        ))}

        <a
            className="block mt-6 bg-green-500 text-white text-center p-3 rounded"
            href={`https://wa.me/${data.whatsapp}`}
        >
            Pedir por WhatsApp
        </a>

        </div>
    );
}