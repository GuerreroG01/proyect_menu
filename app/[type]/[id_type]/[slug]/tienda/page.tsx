"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import StoreHeader from "./StoreHeader";
import StoreItemCard from "./StoreItemCard";
import CartBar from "./CartBar";
import LoadingStore from "./LoadingStore";
import { useStore } from "./useStore";
import { useCart } from "./useCart";
import LocationAlert from "../menu/LocationAlert";

type ProductItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  target?: "masculino" | "femenino" | "unisex";
  features?: {
    tallas?: string[];
    colores?: string[] | { name: string; hex: string }[];
  };
};

type GenderType = "todos" | "caballero" | "dama";

export default function StorePage(props: {
  params: Promise<{ type: string; id_type: string; slug: string }>;
}) {
  const router = useRouter();
  const params = use(props.params);

  const folder = params.id_type === "3" ? "tiendas" : "menus";
  const { data, loading } = useStore(folder, params.slug);

  const { cart, addToCart, removeFromCart, totalItems, subtotal } = useCart();

  const [activeCategory, setActiveCategory] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderType, setOrderType] = useState<"local" | "delivery">("delivery");
  const [locationError, setLocationError] = useState("");
  
  const [gender, setGender] = useState<GenderType>("todos");

  if (loading) return <LoadingStore />;
  
  if (!data?.categories?.length) {
    return (
      <div className="p-10 text-center font-bold text-slate-400">
        Tienda no encontrada
      </div>
    );
  }

  const safeCategory = activeCategory >= data.categories.length ? 0 : activeCategory;

  let itemsToFilter = searchQuery
    ? data.categories
        .flatMap((c: any) => c.items || [])
        .filter((i: ProductItem) =>
          i.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    : data.categories[safeCategory].items || [];

  // Filtrado adaptado a las opciones del Select
  const itemsToShow = gender === "todos" 
    ? itemsToFilter 
    : itemsToFilter.filter((item: ProductItem) => {
        const itemTarget = item.target === "masculino" ? "caballero" : item.target === "femenino" ? "dama" : "unisex";
        return itemTarget === gender || item.target === "unisex";
      });

  const deliveryFee = orderType === "delivery" ? (data.delivery ?? 0) : 0;
  const totalPrice = subtotal + deliveryFee;

  const getLocation = async (): Promise<{ lat: number; lng: number } | "denied" | null> => {
    if (!navigator.geolocation) return null;
    try {
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({ name: "geolocation" });
        if (permission.state === "denied") return "denied";
      }
    } catch (error) {
      console.log("Permission API error:", error);
    }
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => resolve(null),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    });
  };

  const sendWhatsApp = async () => {
    if (totalItems === 0) return;
    setLocationError("");
    let locationSection = "";

    if (orderType === "delivery") {
      const location = await getLocation();
      if (location === "denied") {
        setLocationError(`La ubicación está bloqueada. Habilítala en la configuración de tu navegador.`);
        return;
      }
      if (!location) {
        setLocationError("Debes autorizar tu ubicación para realizar envíos a domicilio.");
        return;
      }
      const mapLink = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
      locationSection = `\n*UBICACIÓN DE ENVÍO*\n${mapLink}\n`;
    }

    const itemsText = Object.values(cart)
      .map(
        (item: any) =>
          `• ${item.quantity}x ${item.name} ${
            item.selectedSize ? `[Talla: ${item.selectedSize}]` : ""
          } ${item.selectedColor ? `[Color: ${item.selectedColor}]` : ""} — $${(
            item.price * item.quantity
          ).toFixed(2)}`
      )
      .join("\n");

    const deliveryText = orderType === "delivery" ? `Envío a domicilio: $${deliveryFee.toFixed(2)}` : "";

    const message = `
*${data.name}*
━━━━━━━━━━━━━━
*NUEVO PEDIDO*

${itemsText}
━━━━━━━━━━━━━━
*RESUMEN*
Subtotal: $${subtotal.toFixed(2)}
${deliveryText}
*TOTAL: $${totalPrice.toFixed(2)}*
━━━━━━━━━━━━━━
*MÉTODO DE ENTREGA*
${orderType === "delivery" ? "Envío a domicilio" : "Retiro en tienda"}
${locationSection}
`.trim();

    window.open(
      `https://wa.me/${data.whatsapp}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Pasamos las propiedades de género al Header para sincronizar el Select */}
      <StoreHeader
        name={data.name}
        logo={data.logo}
        categories={data.categories}
        activeCategory={safeCategory}
        setActiveCategory={setActiveCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        router={router}
        gender={gender}
        setGender={setGender}
      />

      <main className="p-5 max-w-2xl mx-auto w-full flex-1 mb-32">
        <LocationAlert show={!!locationError} message={locationError} />
        
        {/* LOS BOTONES FLOTANTES DE GÉNERO HAN SIDO ELIMINADOS DE AQUÍ */}

        <div className="flex justify-between mb-6">
          <h2 className="font-bold uppercase text-slate-900 tracking-wide">
            {searchQuery ? "Resultados" : data.categories[safeCategory].name}
          </h2>
          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
            {itemsToShow.length} productos
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={safeCategory + searchQuery + gender}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid gap-6"
          >
            {itemsToShow.map((item: ProductItem, i: number) => (
              <StoreItemCard
                key={item.id || item.name}
                item={item}
                quantity={cart[item.id || item.name]?.quantity || 0}
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