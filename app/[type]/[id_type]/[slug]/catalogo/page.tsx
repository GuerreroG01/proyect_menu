"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";

import BakeryHeader from "./BakeryHeader";
import BakerySearch from "./BakerySearch";
import BakeryCategories from "./BakeryCategories";
import BakeryItemCard from "./BakeryItemCard";
import BakeryCartBar from "./BakeryCartBar";
import LoadingBakery from "./LoadingBakery";

import { useBakery } from "./usebakery";
import { useCart } from "./useCart";

type Params = {
  type: string;
  id_type: string;
  slug: string;
};

export default function BakeryPage(props: {
  params: Promise<Params>;
}) {
  const router = useRouter();
  const params = use(props.params) as Params;

  const folder = params.id_type === "1" ? "menus" : "catalogos";

  const { data, loading } = useBakery(folder, params.slug);
  const { cart, addToCart, removeFromCart } = useCart();

  const [activeCategory, setActiveCategory] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderType, setOrderType] = useState<"local" | "delivery">("local");

  if (loading) return <LoadingBakery />;
  if (!data) return <div className="p-10">Menú no encontrado</div>;

  const itemsToShow = searchQuery
    ? data.categories
        .flatMap((c: any) => c.items)
        .filter((i: any) =>
          i?.name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    : data.categories[activeCategory]?.items || [];
  
  const totalItems = Object.values(cart).reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const subtotal = Object.values(cart).reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const deliveryFee = orderType === "delivery" ? (data?.delivery ?? 0) : 0;

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

  return (
    <div className="min-h-screen bg-[#FFF8F1] flex flex-col">

      <BakeryHeader
        data={data}
        router={router}
      />

      <BakerySearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {!searchQuery && (
        <BakeryCategories
          categories={data.categories}
          active={activeCategory}
          setActive={setActiveCategory}
        />
      )}

      <BakeryItemCard
        items={itemsToShow}
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
      />

      <BakeryCartBar
        totalItems={totalItems}
        totalPrice={totalPrice}
        orderType={orderType}
        setOrderType={setOrderType}
        onConfirm={sendWhatsApp}
      />
    </div>
  );
}