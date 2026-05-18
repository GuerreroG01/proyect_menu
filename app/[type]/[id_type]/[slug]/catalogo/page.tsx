"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { 
  Phone, Search, Plus, Minus, ShoppingBag, ArrowLeft, X 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Bike, Store, Coffee } from "lucide-react";

type MenuItem = { 
  name: string; 
  description?: string; 
  price: number; 
  image?: string 
};

type Category = { 
  name: string; 
  items: MenuItem[]
};

type Menu = { 
  name: string; 
  whatsapp: string;
  logo?: string;
  delivery: number;
  categories: Category[] 
};

type CartItem = { 
  name: string; 
  price: number; 
  quantity: number 
};

export default function MenuPage(props: { params: Promise<{ type: string; id_type: string; slug: string }>; }) {
  const router = useRouter();
  const params = use(props.params);
  const [data, setData] = useState<Menu | null>(null);
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<{ [key: string]: CartItem }>({});
  const [loading, setLoading] = useState(true);
  const [orderType, setOrderType] = useState<"local" | "delivery">("local");
  const folder = params.id_type === "1" ? "menus" : "catalogos";
  useEffect(() => {
      const load = async () => {
        try {
          const res = await fetch(`/${folder}/${params.slug}/info.json`);
          if (!res.ok) {
            setData(null);
            return;
          }

          const json = await res.json();

          const normalizedCategories = await Promise.all(
            json.categories.map(async (cat: any) => {
              try {
                const res = await fetch(cat.file);
                const raw = await res.json();

                const items = Array.isArray(raw)
                  ? raw
                  : raw?.items || [];

                return {
                  id: cat.id,
                  name: cat.name,
                  items,
                };
              } catch {
                return {
                  id: cat.id,
                  name: cat.name,
                  items: [],
                };
              }
            })
          );

          setData({
            ...json,
            categories: normalizedCategories,
          });

        } catch (error) {
          console.error("Error cargando el menú:", error);
          setData(null);
        } finally {
          setLoading(false);
        }
      };

      load();
    }, [folder, params.slug]);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => ({
      ...prev,
      [item.name]: {
        name: item.name,
        price: item.price,
        quantity: (prev[item.name]?.quantity || 0) + 1,
      },
    }));
  };

  const removeFromCart = (name: string) => {
    setCart((prev) => {
      const existing = prev[name];
      if (!existing) return prev;
      if (existing.quantity === 1) {
        const { [name]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [name]: { ...existing, quantity: existing.quantity - 1 } };
    });
  };

  const totalItems = Object.values(cart).reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = Object.values(cart).reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const deliveryFee =
    orderType === "delivery" ? (data?.delivery ?? 0) : 0;

  const totalPrice = subtotal + deliveryFee;

  const sendWhatsApp = () => {
    if (totalItems === 0 || !data) return;

    let message = `🥐 Pedido de Panadería - ${data.name}\n\n`;

    Object.values(cart).forEach(item => {
      message += `• ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toFixed(2)})\n`;
    });

    message += `\nSubtotal: $${subtotal.toFixed(2)}\n`;

    if (orderType === "delivery") {
      message += `Entrega: $${deliveryFee.toFixed(2)}\n`;
    }

    message += `*Total: $${totalPrice.toFixed(2)}*\n\n`;

    message += `Tipo de pedido: ${
      orderType === "delivery" ? "A domicilio 🛵" : "Recoger en tienda 🏪"
    }`;

    window.open(
      `https://wa.me/${data.whatsapp}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#FFF8F1]">
      <motion.div 
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="w-16 h-16 bg-[#C97B2A] rounded-[2rem] flex items-center justify-center shadow-xl"
      >
        <Coffee className="text-white" size={28} />
      </motion.div>
      <p className="mt-6 text-[#8B5E3C] font-bold tracking-widest uppercase text-[10px]">
        Horneando el menú...
      </p>
    </div>
  );

  if (!data) return (
    <div className="p-10 text-center font-bold text-[#8B5E3C]">
      Menú no encontrado.
    </div>
  );

  const itemsToShow = searchQuery 
    ? data.categories.flatMap(c => c.items).filter(i => 
        i.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : data.categories[activeCategory].items;

  return (
    <div className="min-h-screen bg-[#FFF8F1] flex flex-col">

      {/* HEADER */}
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

            <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100/50 border border-slate-100 overflow-hidden relative group-hover:scale-110 transition-transform duration-500">
              {data.logo ? (
                <img
                  src={data.logo}
                  alt={`Logo de ${data.name}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                /* Icono de respaldo en caso de que no tenga logo en el JSON */
                <Coffee size={18} className="text-[#00A7E1]" />
              )}
            </div>
          </div>

          {/* SEARCH */}
          <div className="relative flex items-center">
            <Search className="absolute left-4 text-[#8B5E3C]" size={18} />
            <input 
              type="text" 
              value={searchQuery} 
              placeholder="Busca tu pan o dulce..." 
              className="w-full bg-[#FFF3E6] rounded-[1.5rem] py-3.5 pl-12 pr-12 text-sm text-[#3A2E2A] placeholder:text-[#8B5E3C] outline-none"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-4 p-1 text-[#8B5E3C]"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* CATEGORIES */}
        {!searchQuery && (
          <nav className="flex gap-3 overflow-x-auto px-5 pb-4">
            {data.categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setActiveCategory(i)}
                className={`px-6 py-2.5 rounded-[1.2rem] text-xs font-bold whitespace-nowrap ${
                  activeCategory === i 
                    ? "bg-[#C97B2A] text-white"
                    : "bg-[#FFF3E6] text-[#8B5E3C]"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </nav>
        )}
      </header>

      {/* MAIN */}
      <main className="p-5 max-w-2xl mx-auto w-full flex-1 mb-32">

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-black text-[#3A2E2A] uppercase tracking-widest">
            {searchQuery ? "Resultados" : data.categories[activeCategory].name}
          </h2>
          <span className="text-[10px] font-bold text-[#8B5E3C] bg-[#FFF3E6] px-3 py-1 rounded-full">
            {itemsToShow.length} productos
          </span>
        </div>

        <div className="grid gap-6">
          <AnimatePresence>
            {itemsToShow.map((item, i) => {
              const quantity = cart[item.name]?.quantity || 0;

              return (
                <motion.div 
                  key={item.name}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white/80 p-3 rounded-[2.2rem] border border-[#F2D6B3] flex gap-4 items-center"
                >

                  <div className="h-24 w-24 rounded-[1.8rem] bg-[#FFF3E6] overflow-hidden flex-shrink-0 relative">
                    {item.image ? (
                      <img src={item.image} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#F2D6B3]">
                        <Coffee size={28} />
                      </div>
                    )}

                    {quantity > 0 && (
                      <div className="absolute inset-0 bg-[#C97B2A]/20 flex items-center justify-center">
                        <div className="bg-[#C97B2A] text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-xs">
                          {quantity}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 pr-4">
                    <h3 className="font-black text-[#3A2E2A]">{item.name}</h3>

                    {item.description && (
                      <p className="text-[#8B5E3C] text-[11px] mt-1">
                        {item.description}
                      </p>
                    )}

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-lg font-black text-[#3A2E2A]">
                        ${item.price.toFixed(2)}
                      </span>

                      <div className="flex items-center">
                        {quantity > 0 ? (
                          <div className="flex items-center bg-[#3A2E2A] rounded-2xl p-1 gap-2">
                            <button onClick={() => removeFromCart(item.name)}>
                              <Minus className="text-white" size={14} />
                            </button>
                            <span className="text-white text-xs w-4 text-center">
                              {quantity}
                            </span>
                            <button onClick={() => addToCart(item)}>
                              <Plus className="text-[#C97B2A]" size={14} />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => addToCart(item)}
                            className="bg-[#FFF3E6] text-[#3A2E2A] border border-[#F2D6B3] px-4 py-2 rounded-xl text-[10px] font-black uppercase"
                          >
                            Agregar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </main>

      {/* CART */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div 
            className="fixed bottom-6 inset-x-0 px-6"
          >
            <button 
              onClick={sendWhatsApp}
              className="max-w-md mx-auto w-full bg-[#3A2E2A] text-white px-5 py-4 rounded-[2.5rem] flex items-center justify-between"
            >
              <div>
                <div className="flex gap-2 mb-2">
                  <div
                    onClick={(e) => { e.stopPropagation(); setOrderType("local"); }}
                    className={`px-3 py-1 rounded-full text-[10px] ${
                      orderType === "local"
                        ? "bg-[#C97B2A]"
                        : "bg-white/10"
                    }`}
                  >
                    <Store size={12} /> Tienda
                  </div>

                  <div
                    onClick={(e) => { e.stopPropagation(); setOrderType("delivery"); }}
                    className={`px-3 py-1 rounded-full text-[10px] ${
                      orderType === "delivery"
                        ? "bg-[#C97B2A]"
                        : "bg-white/10"
                    }`}
                  >
                    <Bike size={12} /> Delivery
                  </div>
                </div>

                <div className="text-xl font-black">
                  ${totalPrice.toFixed(2)} ({totalItems})
                </div>
              </div>

              <div className="bg-[#C97B2A] px-6 py-3 rounded-[2rem] font-black text-[11px]">
                Encargar
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}