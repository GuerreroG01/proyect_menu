"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Phone, Utensils, Search, Plus, Minus, 
  ShoppingBag, ArrowLeft, X 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  categories: Category[] 
};

type CartItem = { 
  name: string; 
  price: number; 
  quantity: number 
};

export default function MenuPage({ params }: { params: Promise<{ restaurant: string }> }) {
  const router = useRouter();
  
  const [data, setData] = useState<Menu | null>(null);
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<{ [key: string]: CartItem }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(async (resParams) => {
      try {
        const res = await fetch(`/menus/${resParams.restaurant}.json`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (error) {
        console.error("Error cargando el menú:", error);
      } finally {
        setLoading(false);
      }
    });
  }, [params]);

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
  const totalPrice = Object.values(cart).reduce((acc, item) => acc + item.price * item.quantity, 0);

  const sendWhatsApp = () => {
    if (totalItems === 0 || !data) return;
    let message = `*¡Nuevo Pedido - ${data.name}!* 📝\n\n`;
    Object.values(cart).forEach(item => {
      message += `• ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toFixed(2)})\n`;
    });
    message += `\n*Total: $${totalPrice.toFixed(2)}*`;
    window.open(`https://wa.me/${data.whatsapp}?text=${encodeURIComponent(message)}`, "_blank");
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="w-16 h-16 bg-[#00A7E1] rounded-[2rem] flex items-center justify-center shadow-xl shadow-blue-100"
      >
        <Utensils className="text-white" size={32} />
      </motion.div>
      <p className="mt-6 text-slate-400 font-bold tracking-widest uppercase text-[10px]">
        Preparando el Menú
      </p>
    </div>
  );

  if (!data) return <div className="p-10 text-center font-bold text-slate-400">Menú no encontrado.</div>;

  const itemsToShow = searchQuery 
    ? data.categories.flatMap(c => c.items).filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : data.categories[activeCategory].items;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col selection:bg-[#00A7E1]/20">
      
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-2xl mx-auto px-5 py-4">
          
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => router.back()}
              className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors text-slate-600"
            >
              <ArrowLeft size={20} />
            </button>

            <div className="text-center">
              <span className="text-[9px] font-black text-[#00A7E1] uppercase tracking-[0.3em]">
                Menú Digital
              </span>
              <h1 className="text-xl font-black text-[#002B5B] tracking-tight leading-none uppercase">
                {data.name}
              </h1>
            </div>

            <div className="w-10 h-10 bg-[#002B5B] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
               <Utensils size={18} className="text-[#00A7E1]" />
            </div>
          </div>

          <div className="relative flex items-center">
            <Search className="absolute left-4 text-slate-400" size={18} />
            <input 
              type="text" 
              value={searchQuery} 
              placeholder="Busca tu plato favorito..." 
              className="w-full bg-slate-100 border-none rounded-[1.5rem] py-3.5 pl-12 pr-12 text-sm text-slate-900 caret-[#00A7E1] placeholder:text-slate-400 focus:ring-2 focus:ring-[#00A7E1]/20 outline-none transition-all"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-4 p-1 bg-slate-200/60 hover:bg-slate-200 text-slate-500 rounded-full transition-colors active:scale-90"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {!searchQuery && (
          <nav className="flex gap-3 overflow-x-auto px-5 pb-4 no-scrollbar">
            {data.categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setActiveCategory(i)}
                className={`px-6 py-2.5 rounded-[1.2rem] text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === i 
                    ? "bg-[#00A7E1] text-white shadow-lg shadow-blue-100 scale-105" 
                    : "bg-white text-slate-400 border border-slate-100 hover:bg-slate-50"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </nav>
        )}
      </header>

      <main className="p-5 max-w-2xl mx-auto w-full flex-1 mb-32">
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
            <span className="w-8 h-[2px] bg-[#00A7E1] rounded-full" />
            {searchQuery ? "Resultados" : data.categories[activeCategory].name}
          </h2>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
            {itemsToShow.length} items
          </span>
        </div>

        <div className="grid gap-6">
          <AnimatePresence>
            {itemsToShow.map((item, i) => {
              const quantity = cart[item.name]?.quantity || 0;

              return (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={item.name} 
                  className="group bg-white p-2 rounded-[2.5rem] shadow-sm border border-slate-100 flex gap-4 items-center hover:shadow-md transition-all"
                >
                  <div className="h-24 w-24 rounded-[2rem] bg-slate-50 overflow-hidden flex-shrink-0 relative">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-200">
                        <Utensils size={32} />
                      </div>
                    )}

                    {quantity > 0 && (
                      <div className="absolute inset-0 bg-[#00A7E1]/20 backdrop-blur-[2px] flex items-center justify-center">
                        <div className="bg-[#00A7E1] text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shadow-lg">
                          {quantity}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 pr-4">
                    <h3 className="font-black text-slate-800 text-base leading-tight">{item.name}</h3>
                    {item.description && (
                      <p className="text-slate-400 text-[11px] mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-lg font-black text-slate-900 tracking-tighter">
                        ${item.price.toFixed(2)}
                      </span>

                      <div className="flex items-center">
                        {quantity > 0 ? (
                          <div className="flex items-center bg-[#002B5B] rounded-2xl p-1 gap-2 shadow-lg">
                            <button 
                              onClick={() => removeFromCart(item.name)} 
                              className="w-8 h-8 flex items-center justify-center text-white hover:text-[#00A7E1] transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="font-black text-white text-xs w-4 text-center">{quantity}</span>
                            <button 
                              onClick={() => addToCart(item)} 
                              className="w-8 h-8 flex items-center justify-center bg-[#00A7E1] rounded-xl text-white"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => addToCart(item)}
                            className="bg-slate-50 text-slate-900 h-10 px-4 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest hover:bg-[#00A7E1] hover:text-white transition-all flex items-center gap-2 border border-slate-100"
                          >
                            Añadir <Plus size={12} />
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

      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 inset-x-0 px-6 z-50"
          >
            <button 
              onClick={sendWhatsApp}
              className="max-w-md mx-auto w-full bg-[#002B5B] text-white p-2 pl-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-between group overflow-hidden"
            >
              <div className="flex flex-col items-start">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Total Pedido
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-white">${totalPrice.toFixed(2)}</span>
                  <span className="text-[10px] font-bold text-[#00A7E1]">({totalItems} items)</span>
                </div>
              </div>

              <div className="bg-[#00A7E1] hover:bg-[#0093c8] px-8 py-4 rounded-[2.1rem] flex items-center gap-3 font-black text-xs uppercase tracking-widest transition-all group-active:scale-95 shadow-lg">
                Confirmar <Phone size={16} />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}