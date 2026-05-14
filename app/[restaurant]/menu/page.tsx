"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Phone, Utensils, Search, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";

// --- Definición de Tipos ---
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
  
  // --- Estados ---
  const [data, setData] = useState<Menu | null>(null);
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<{ [key: string]: CartItem }>({});
  const [loading, setLoading] = useState(true);

  // --- Carga de Datos ---
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

  // --- Lógica del Carrito ---
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

  // --- Envío a WhatsApp ---
  const sendWhatsApp = () => {
    if (totalItems === 0 || !data) return;
    
    let message = `*¡Nuevo Pedido - ${data.name}!* 📝\n\n`;
    message += `*Detalle:*\n`;
    Object.values(cart).forEach(item => {
      message += `• ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toFixed(2)})\n`;
    });
    message += `\n*Total a pagar: $${totalPrice.toFixed(2)}*`;
    
    window.open(`https://wa.me/${data.whatsapp}?text=${encodeURIComponent(message)}`, "_blank");
  };

  // --- Filtrado ---
  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center animate-bounce">
        <Utensils className="text-white" size={24} />
      </div>
      <p className="mt-4 text-slate-400 font-medium animate-pulse">Cargando menú...</p>
    </div>
  );

  if (!data) return <div className="p-10 text-center">Menú no encontrado.</div>;

  const itemsToShow = searchQuery 
    ? data.categories.flatMap(c => c.items).filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : data.categories[activeCategory].items;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* HEADER NAVBAR */}
      <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-slate-100">
        <div className="max-w-2xl mx-auto px-5 pt-6 pb-4">
          <div className="flex items-center justify-between mb-5">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-slate-100 active:scale-90 rounded-full transition-all text-slate-500"
            >
              <ArrowLeft size={22} />
            </button>
            <h1 className="text-xl font-black text-slate-800 tracking-tight uppercase italic">
              {data.name}
            </h1>
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
               <Utensils size={18} className="text-orange-600" />
            </div>
          </div>

          {/* BUSCADOR */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="¿Qué vas a pedir hoy?" 
              className="w-full bg-slate-100 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none text-slate-700 font-medium"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* CATEGORÍAS */}
        {!searchQuery && (
          <nav className="flex gap-2 overflow-x-auto px-5 pb-4 no-scrollbar">
            {data.categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setActiveCategory(i)}
                className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeCategory === i 
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-200" 
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </nav>
        )}
      </header>

      {/* CUERPO DEL MENÚ */}
      <main className="p-5 max-w-2xl mx-auto w-full flex-1 mb-32">
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">
          {searchQuery ? 'Resultados de búsqueda' : data.categories[activeCategory].name}
        </h2>

        <div className="grid gap-4">
          {itemsToShow.map((item, i) => {
            const quantity = cart[item.name]?.quantity || 0;
            return (
              <div key={i} className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 flex gap-4 items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 text-lg">{item.name}</h3>
                  {item.description && (
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed italic">{item.description}</p>
                  )}
                  
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-black text-slate-900">${item.price.toFixed(2)}</span>
                    
                    {/* CONTROLES DE CANTIDAD */}
                    <div className="flex items-center bg-slate-50 rounded-2xl p-1">
                      {quantity > 0 ? (
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => removeFromCart(item.name)} 
                            className="w-8 h-8 flex items-center justify-center bg-white rounded-xl shadow-sm text-slate-600 active:scale-90 transition-transform"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-bold text-slate-800 text-sm">{quantity}</span>
                          <button 
                            onClick={() => addToCart(item)} 
                            className="w-8 h-8 flex items-center justify-center bg-orange-500 rounded-xl shadow-md text-white active:scale-90 transition-transform"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => addToCart(item)}
                          className="bg-slate-900 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter hover:bg-orange-600 transition-colors"
                        >
                          Agregar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="h-20 w-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-300">
                  <Utensils size={28} />
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* FOOTER WHATSAPP */}
      {totalItems > 0 && (
        <div className="fixed bottom-8 inset-x-0 px-6 z-50">
          <button 
            onClick={sendWhatsApp}
            className="max-w-md mx-auto w-full bg-slate-900 text-white p-4 rounded-[2.5rem] shadow-2xl flex items-center justify-between transition-all active:scale-95 animate-in slide-in-from-bottom-10"
          >
            <div className="flex items-center gap-4">
              <div className="bg-orange-500 p-3 rounded-2xl relative">
                <ShoppingBag size={22} className="text-white" />
                <span className="absolute -top-1 -right-1 bg-white text-slate-900 text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-slate-900">
                  {totalItems}
                </span>
              </div>
              <div className="text-left">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Pedido</p>
                <p className="font-black text-xl text-orange-500">${totalPrice.toFixed(2)}</p>
              </div>
            </div>
            <div className="bg-green-500 px-6 py-3 rounded-[1.5rem] flex items-center gap-2 font-black text-xs uppercase shadow-lg shadow-green-500/20">
              Pedir <Phone size={14} />
            </div>
          </button>
        </div>
      )}
    </div>
  );
}