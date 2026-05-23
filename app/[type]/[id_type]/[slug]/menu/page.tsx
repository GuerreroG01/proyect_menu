"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import MenuHeader from "./MenuHeader";
import MenuItemCard from "./MenuItemCard";
import CartBar from "./CartBar";
import LoadingMenu from "./LoadingMenu";
import { useMenu } from "./useMenu";
import { useCart } from "./useCart";

type MenuItem = {
  name: string;
  description?: string;
  price: number;
  image?: string;
};

export default function MenuPage(props: {
  params: Promise<{ type: string; id_type: string; slug: string }>;
}) {
  const router = useRouter();
  const params = use(props.params);

  const folder = params.id_type === "1" ? "menus" : "catalogos";

  const { data, loading } = useMenu(folder, params.slug);

  const { cart, addToCart, removeFromCart, totalItems, subtotal } =
    useCart();

  const [activeCategory, setActiveCategory] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderType, setOrderType] = useState<"local" | "delivery">("local");

  if (loading) return <LoadingMenu />;

  if (!data?.categories?.length) {
    return (
      <div className="p-10 text-center font-bold text-slate-400">
        Menú no encontrado
      </div>
    );
  }

  const safeCategory =
    activeCategory >= data.categories.length ? 0 : activeCategory;

  const itemsToShow = searchQuery
    ? data.categories
        .flatMap((c: any) => c.items || [])
        .filter((i: MenuItem) =>
          i.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    : data.categories[safeCategory].items || [];

  const deliveryFee =
    orderType === "delivery" ? (data.delivery ?? 0) : 0;

  const totalPrice = subtotal + deliveryFee;

  const sendWhatsApp = () => {
    if (totalItems === 0) return;

    let message = `¡Nuevo Pedido - ${data.name}!\n\n`;

    Object.values(cart).forEach((item: any) => {
      message += `• ${item.quantity}x ${item.name} ($${(
        item.price * item.quantity
      ).toFixed(2)})\n`;
    });

    message += `\nSubtotal: $${subtotal.toFixed(2)}\n`;

    if (orderType === "delivery") {
      message += `Delivery: $${deliveryFee.toFixed(2)}\n`;
    }

    message += `*Total: $${totalPrice.toFixed(2)}*\n`;

    message += `\nTipo de pedido: ${
      orderType === "delivery" ? "A domicilio" : "En el local"
    }`;

    window.open(
      `https://wa.me/${data.whatsapp}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">

      <MenuHeader
        name={data.name}
        logo={data.logo}
        categories={data.categories}
        activeCategory={safeCategory}
        setActiveCategory={setActiveCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        router={router}
      />

      <main className="p-5 max-w-2xl mx-auto w-full flex-1 mb-32">

        <div className="flex justify-between mb-6">
          <h2 className="font-bold uppercase text-slate-900 tracking-wide">
            {searchQuery
              ? "Resultados"
              : data.categories[safeCategory].name}
          </h2>

          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
            {itemsToShow.length} items
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={safeCategory + searchQuery}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid gap-6"
          >
            {itemsToShow.map((item: MenuItem, i: number) => (
              <MenuItemCard
                key={item.name}
                item={item}
                quantity={cart[item.name]?.quantity || 0}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                index={i}
              />
            ))}
          </motion.div>
        </AnimatePresence>

      </main>

      <CartBar
        totalItems={totalItems}
        totalPrice={totalPrice}
        orderType={orderType}
        setOrderType={setOrderType}
        onConfirm={sendWhatsApp}
      />
    </div>
  );
}