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
import Pagination from "./pagination";
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
  const [actionType, setActionType] = useState<"pedir" | "encargar" | null>(null);
  const [deliveryType, setDeliveryType] = useState<"local" | "delivery" | null>(null);
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [locationError, setLocationError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [debouncedSearch] = useDebounce(searchQuery, 300);
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
    safeCategory,
    currentPage
  );

  const { results: searchResults, loading: searchLoading } =
  useGlobalSearch(folder, params.slug, debouncedSearch);
  const inputLoading = isTyping || searchLoading;
  const itemsToShow = debouncedSearch
    ? searchResults
    : category?.items ?? [];
  
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  if (loading) return <LoadingMenu />;

  if (!data?.categories?.length) {
    return (
      <div className="p-10 text-center font-bold text-slate-400">
        Menú no encontrado
      </div>
    );
  }

  const deliveryFee =
    deliveryType === "delivery" ? (data.delivery ?? 0) : 0;

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

  const formatDate = (date: string) => {
    if (!date) return "";

    return new Intl.DateTimeFormat("es-NI", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(`${date}T00:00:00`));
  };

  const sendWhatsApp = async () => {
    if (totalItems === 0) return;

    setLocationError("");

    let locationSection = "";

    if (deliveryType === "delivery") {

      const location = await getLocation();

      if (location === "denied") {
        setLocationError(
          "La ubicación está bloqueada.\n\nActívala en tu navegador para continuar."
        );
        return;
      }

      if (!location) {
        setLocationError("Debes permitir ubicación para delivery.");
        return;
      }

      const mapLink = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
      locationSection = `Te comparto mi ubicación: ${mapLink}`;}

    const itemsText = Object.values(cart)
      .map(
        (item: any) =>
          `${item.quantity} ${item.name} - $${(
            item.price * item.quantity
          ).toFixed(2)}`
      )
      .join("\n");

    const message = `
Hola, soy ${data.name}.
Quiero realizar un pedido con los siguientes productos:

${itemsText}

El resumen de mi compra es:
Subtotal: $${subtotal.toFixed(2)}
${
  deliveryType === "delivery"
    ? `Costo de delivery: $${deliveryFee.toFixed(2)}`
    : ""
}
Total a pagar: $${totalPrice.toFixed(2)}

${
  actionType === "encargar"
    ? `Me gustaría dejarlo encargado para el día ${formatDate(pickupDate)} a las ${pickupTime}.`
    : `Me gustaría realizar el pedido ahora.`
}
La entrega sería ${
  deliveryType === "delivery"
    ? "a domicilio"
    : "retirando en el local"
}.

${locationSection}

¿Me podrían confirmar si está todo correcto?
Muchas gracias.
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
        setCurrentPage={setCurrentPage}
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
            key={`${activeCategory}-${currentPage}-${searchQuery}`}
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
        {!searchQuery && category?.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={category?.totalPages ?? 1}
            onPageChange={setCurrentPage}
          />
        )}

      </main>

      <CartBar
        totalItems={totalItems}
        totalPrice={totalPrice}
        actionType={actionType}
        setActionType={setActionType}
        deliveryType={deliveryType}
        setDeliveryType={setDeliveryType}
        pickupDate={pickupDate}
        setPickupDate={setPickupDate}
        pickupTime={pickupTime}
        setPickupTime={setPickupTime}
        onConfirm={sendWhatsApp}
      />
    </div>
  );
}