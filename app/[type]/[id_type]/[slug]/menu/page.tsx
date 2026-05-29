"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import MenuHeader from "./MenuHeader";
import MenuItemCard from "./MenuItemCard";
import CartBar from "./CartBar";
import LoadingMenu from "./LoadingMenu";
import { useMenu } from "./useMenu";
import { useCategory } from "./useCategory";
import { useCart } from "./useCart";
import LocationAlert from "./LocationAlert";
import { useGlobalSearch } from "../../../../lib/useGlobalSearch";
import { useDebounce } from "use-debounce";

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

  const [searchQuery, setSearchQuery] = useState("");
  const [orderType, setOrderType] = useState<"local" | "delivery">("local");
  const [locationError, setLocationError] = useState("");

  const [activeCategory, setActiveCategory] = useState<string>("");
  const [debouncedSearch] = useDebounce(searchQuery, 600);
  const isTyping = searchQuery !== debouncedSearch;
  const safeCategory =
    activeCategory || data?.categories?.[0]?.id || "";

  useEffect(() => {
    if (data?.categories?.length && !activeCategory) {
      setActiveCategory(data.categories[0].id);
    }
  }, [data, activeCategory]);

  const { category } = useCategory(
    folder,
    params.slug,
    safeCategory
  );

  const { results: searchResults, loading: searchLoading } =
  useGlobalSearch(folder, params.slug, debouncedSearch);
  const inputLoading = isTyping || searchLoading;
  const itemsToShow = searchQuery
    ? searchResults
    : category?.items || [];

  if (loading) return <LoadingMenu />;

  if (!data?.categories?.length) {
    return (
      <div className="p-10 text-center font-bold text-slate-400">
        Menú no encontrado
      </div>
    );
  }

  const deliveryFee =
    orderType === "delivery" ? (data.delivery ?? 0) : 0;

  const totalPrice = subtotal + deliveryFee;

  const getLocation = async (): Promise<
    { lat: number; lng: number } | "denied" | null
  > => {
    if (!navigator.geolocation) return null;

    try {
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({
          name: "geolocation",
        });

        if (permission.state === "denied") return "denied";
      }
    } catch {}

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => resolve(null),
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }
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
        setLocationError(`
          La ubicación está bloqueada.

          Actívala en tu navegador para continuar.
        `);
        return;
      }

      if (!location) {
        setLocationError("Debes permitir ubicación para delivery.");
        return;
      }

      const mapLink = `https://www.google.com/maps?q=${location.lat},${location.lng}`;

      locationSection = `
*UBICACIÓN DEL CLIENTE*
${mapLink}
      `;
    }

    const itemsText = Object.values(cart)
      .map(
        (item: any) =>
          `• ${item.quantity}x ${item.name} — $${(
            item.price * item.quantity
          ).toFixed(2)}`
      )
      .join("\n");

    const message = `
*${data.name}*

━━━━━━━━━━━━━━

*PEDIDO*

${itemsText}

━━━━━━━━━━━━━━

*RESUMEN*

Subtotal: $${subtotal.toFixed(2)}
${orderType === "delivery" ? `Delivery: $${deliveryFee.toFixed(2)}` : ""}

*TOTAL: $${totalPrice.toFixed(2)}*

━━━━━━━━━━━━━━

*ENTREGA*
${orderType === "delivery" ? "A domicilio" : "Retiro en local"}

${locationSection}
    `.trim();

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
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchLoading={inputLoading}
        router={router}
      />

      <main className="p-5 max-w-2xl mx-auto w-full flex-1 mb-32">

        <LocationAlert show={!!locationError} message={locationError} />

        <div className="flex justify-between mb-6">
          <h2 className="font-bold uppercase text-slate-900 tracking-wide">
            {searchQuery ? "Resultados" : category?.name}
          </h2>

          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
            {itemsToShow.length} items
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory + searchQuery}
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