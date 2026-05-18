"use client";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  type LucideIcon,
  Search,
  Plus,
  Minus,
  ArrowLeft,
  X,
} from "lucide-react";
import { motion } from "framer-motion";

export type MenuItem = {
  name: string;
  description?: string;
  price: number;
  image?: string;
};

export type Category = {
  name: string;
  items: MenuItem[];
};

export type Menu = {
  name: string;
  whatsapp: string;
  delivery: number;
  categories: Category[];
};

type CartItem = {
  name: string;
  price: number;
  quantity: number;
};

type ThemeConfig = {
  badgeLabel: string;
  headerLabel: string;
  searchPlaceholder: string;
  itemTitleColor: string;
  itemDescriptionColor: string;
  buttonAccent: string;
  buttonAccentHover: string;
  bgAccent: string;
  actionPanelBg: string;
  actionButtonBg: string;
  actionButtonText: string;
  cardBg: string;
  cardBorder: string;
};

type MenuClientProps = {
  data: Menu;
  variant: "menu" | "catalogo";
  icon: LucideIcon;
};

const themes: Record<"menu" | "catalogo", ThemeConfig> = {
  menu: {
    badgeLabel: "Menú Digital",
    headerLabel: "Busca tu plato favorito...",
    searchPlaceholder: "Busca tu plato favorito...",
    itemTitleColor: "text-slate-800",
    itemDescriptionColor: "text-slate-400",
    buttonAccent: "bg-[#00A7E1] text-white",
    buttonAccentHover: "hover:bg-[#0091c9]",
    bgAccent: "bg-[#F8FAFC]",
    actionPanelBg: "bg-[#002B5B]",
    actionButtonBg: "bg-[#00A7E1]",
    actionButtonText: "text-white",
    cardBg: "bg-white",
    cardBorder: "border border-slate-100",
  },
  catalogo: {
    badgeLabel: "Panadería artesanal",
    headerLabel: "Busca tu pan o dulce...",
    searchPlaceholder: "Busca tu pan o dulce...",
    itemTitleColor: "text-[#3A2E2A]",
    itemDescriptionColor: "text-[#8B5E3C]",
    buttonAccent: "bg-[#C97B2A] text-white",
    buttonAccentHover: "hover:bg-[#b0661f]",
    bgAccent: "bg-[#FFF8F1]",
    actionPanelBg: "bg-[#3A2E2A]",
    actionButtonBg: "bg-[#C97B2A]",
    actionButtonText: "text-white",
    cardBg: "bg-[#FFF3E6]",
    cardBorder: "border border-[#F2D6B3]",
  },
};

export default function MenuClient({ data, variant, icon: Icon }: MenuClientProps) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [orderType, setOrderType] = useState<"local" | "delivery">("local");

  const theme = themes[variant];

  const searchItems = useMemo(
    () => data.categories.flatMap((category) => category.items),
    [data.categories]
  );

  const itemsToShow = useMemo(() => {
    if (!searchQuery) {
      return data.categories[activeCategory]?.items ?? [];
    }

    const query = searchQuery.toLowerCase();
    return searchItems.filter((item) => item.name.toLowerCase().includes(query));
  }, [searchQuery, searchItems, data.categories, activeCategory]);

  const addToCart = useCallback((item: MenuItem) => {
    setCart((prev) => ({
      ...prev,
      [item.name]: {
        name: item.name,
        price: item.price,
        quantity: (prev[item.name]?.quantity || 0) + 1,
      },
    }));
  }, []);

  const removeFromCart = useCallback((name: string) => {
    setCart((prev) => {
      const existing = prev[name];
      if (!existing) return prev;
      if (existing.quantity === 1) {
        const { [name]: _, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [name]: { ...existing, quantity: existing.quantity - 1 },
      };
    });
  }, []);

  const totalItems = useMemo(
    () => Object.values(cart).reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const subtotal = useMemo(
    () => Object.values(cart).reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const deliveryFee = orderType === "delivery" ? data.delivery : 0;
  const totalPrice = subtotal + deliveryFee;

  const sendWhatsApp = useCallback(() => {
    if (totalItems === 0) return;

    const lines = [
      `¡Nuevo Pedido - ${data.name}!`,
      "",
      ...Object.values(cart).map(
        (item) => `• ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toFixed(2)})`
      ),
      "",
      `Subtotal: $${subtotal.toFixed(2)}`,
      orderType === "delivery" ? `Delivery: $${deliveryFee.toFixed(2)}` : null,
      `*Total: $${totalPrice.toFixed(2)}*`,
      "",
      `Tipo de pedido: ${orderType === "delivery" ? "A domicilio" : "En el local"}`,
    ].filter(Boolean);

    window.open(
      `https://wa.me/${data.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank"
    );
  }, [cart, data, deliveryFee, orderType, subtotal, totalPrice, totalItems]);

  return (
    <div className={`${theme.bgAccent} min-h-screen flex flex-col selection:bg-[#00A7E1]/20`}>
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-2xl mx-auto px-5 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors text-slate-600"
            >
              <ArrowLeft size={20} />
            </button>

            <div className="text-center">
              <span className="text-[9px] font-black text-[#00A7E1] uppercase tracking-[0.3em]">
                {theme.badgeLabel}
              </span>
              <h1 className="text-xl font-black text-[#002B5B] tracking-tight leading-none uppercase">
                {data.name}
              </h1>
            </div>

            <div className="w-10 h-10 bg-[#002B5B] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
              <Icon size={18} className="text-[#00A7E1]" />
            </div>
          </div>

          <div className="relative flex items-center">
            <Search className="absolute left-4 text-slate-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={theme.searchPlaceholder}
              className="w-full bg-slate-100 border-none rounded-[1.5rem] py-3.5 pl-12 pr-12 text-sm text-slate-900 caret-[#00A7E1] placeholder:text-slate-400 focus:ring-2 focus:ring-[#00A7E1]/20 outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
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
            {data.categories.map((category, index) => (
              <button
                type="button"
                key={category.name}
                onClick={() => setActiveCategory(index)}
                className={`px-6 py-2.5 rounded-[1.2rem] text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === index
                    ? "bg-[#00A7E1] text-white shadow-lg shadow-blue-100 scale-105"
                    : "bg-white text-slate-400 border border-slate-100 hover:bg-slate-50"
                }`}
              >
                {category.name}
              </button>
            ))}
          </nav>
        )}
      </header>

      <main className="p-5 max-w-2xl mx-auto w-full flex-1 mb-32">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
            <span className="w-8 h-[2px] bg-[#00A7E1] rounded-full" />
            {searchQuery ? "Resultados" : data.categories[activeCategory]?.name}
          </h2>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
            {itemsToShow.length} items
          </span>
        </div>

        <div className="grid gap-6">
          {itemsToShow.length === 0 ? (
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center text-slate-500">
              No se encontraron resultados para "{searchQuery}".
            </div>
          ) : (
            itemsToShow.map((item, index) => {
              const quantity = cart[item.name]?.quantity || 0;

              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.03 }}
                  className={`group ${theme.cardBg} ${theme.cardBorder} p-4 rounded-[2.5rem] shadow-sm flex gap-4 items-center hover:shadow-md transition-all`}
                >
                  <div className="h-24 w-24 rounded-[2rem] bg-slate-50 overflow-hidden flex-shrink-0 relative">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Icon size={32} />
                      </div>
                    )}

                    {quantity > 0 && (
                      <div className="absolute inset-0 bg-[#00A7E1]/20 flex items-center justify-center">
                        <div className="bg-[#00A7E1] text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-xs">
                          {quantity}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 pr-4">
                    <h3 className={`font-black ${theme.itemTitleColor} text-base leading-tight`}>
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className={`${theme.itemDescriptionColor} text-[11px] mt-1 leading-relaxed line-clamp-2`}>
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
                              type="button"
                              onClick={() => removeFromCart(item.name)}
                              className="w-8 h-8 flex items-center justify-center text-white hover:text-[#00A7E1] transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="font-black text-white text-xs w-4 text-center">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => addToCart(item)}
                              className="w-8 h-8 flex items-center justify-center bg-[#00A7E1] rounded-xl text-white"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => addToCart(item)}
                            className={`h-10 px-4 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border border-slate-100 ${theme.buttonAccent} ${theme.buttonAccentHover}`}
                          >
                            Añadir <Plus size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </main>

      {totalItems > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-6 inset-x-0 px-6 z-50"
        >
          <button
            type="button"
            onClick={sendWhatsApp}
            className={`max-w-md mx-auto w-full ${theme.actionPanelBg} ${theme.actionButtonText} px-5 py-4 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.18)] flex items-center justify-between gap-4 overflow-hidden`}
          >
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <div
                  role="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setOrderType("local");
                  }}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                    orderType === "local" ? theme.buttonAccent : "bg-white/10 text-white/60"
                  }`}
                >
                  <Icon size={14} />
                  Local
                </div>
                <div
                  role="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setOrderType("delivery");
                  }}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                    orderType === "delivery" ? theme.buttonAccent : "bg-white/10 text-white/60"
                  }`}
                >
                  <Icon size={14} />
                  Delivery
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">
                  ${totalPrice.toFixed(2)}
                </span>
                <span className="text-[10px] font-bold text-[#00A7E1]">
                  ({totalItems} items)
                </span>
              </div>
            </div>

            <div className={`${theme.actionButtonBg} px-6 py-3 rounded-[2rem] font-black text-[11px] uppercase tracking-widest transition-all group-active:scale-95 shadow-lg whitespace-nowrap`}>
              Confirmar
            </div>
          </button>
        </motion.div>
      )}
    </div>
  );
}
