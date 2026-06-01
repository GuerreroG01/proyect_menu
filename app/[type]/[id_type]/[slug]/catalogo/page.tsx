"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import BakeryHeader from "./BakeryHeader";
import BakerySearch from "./BakerySearch";
import BakeryCategories from "./BakeryCategories";
import BakeryItemCard from "./BakeryItemCard";
import BakeryCartBar from "./BakeryCartBar";
import LoadingBakery from "./LoadingBakery";
import { useBakery } from "./usebakery";
import { useCategory } from "./useCategory";
import { useCart } from "./useCart";
import { useGlobalSearch } from "../../../../lib/useGlobalSearch";
import { useDebounce } from "use-debounce";
import LocationAlert from "../menu/LocationAlert";
import Pagination from "./pagination";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderType, setOrderType] = useState<"local" | "delivery">("local");
  const [locationError, setLocationError] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const safeCategory =
    activeCategory || data?.categories?.[0]?.id || "";

  const { results: searchResults, loading: searchLoading } = 
    useGlobalSearch(folder, params.slug, debouncedSearchQuery);

  const hasSearch = debouncedSearchQuery.trim().length > 0;
  const isTyping = searchQuery !== debouncedSearchQuery;
  const inputLoading = isTyping || searchLoading;
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

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  if (loading) return <LoadingBakery />;
  if (!data?.categories?.length)
    return <div className="p-10">Menú no encontrado</div>;

  const itemsToShow = hasSearch
    ? searchResults
    : category?.items || [];

  const totalItems = Object.values(cart).reduce(
    (acc: number, item: any) => acc + item.quantity,
    0
  );

  const subtotal = Object.values(cart).reduce(
    (acc: number, item: any) =>
      acc + item.price * item.quantity,
    0
  );

  const deliveryFee =
    orderType === "delivery" ? (data?.delivery ?? 0) : 0;

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
    if (totalItems === 0 || !data) return;

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

  📍 UBICACIÓN DEL CLIENTE
  ${mapLink}
  `;
    }

    let message = `🥐 Pedido de Panadería - ${data.name}\n\n`;

    Object.values(cart).forEach((item: any) => {
      message += `• ${item.quantity}x ${item.name} ($${(
        item.price * item.quantity
      ).toFixed(2)})\n`;
    });

    message += `\nSubtotal: $${subtotal.toFixed(2)}\n`;

    if (orderType === "delivery") {
      message += `Entrega: $${deliveryFee.toFixed(2)}\n`;
    }

    message += `*Total: $${totalPrice.toFixed(2)}*\n\n`;

    message += `Tipo de pedido: ${
      orderType === "delivery"
        ? "A domicilio 🛵"
        : "Recoger en tienda 🏪"
    }`;

    message += locationSection;

    window.open(
      `https://wa.me/${data.whatsapp}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };
  const totalPages = category?.totalPages ?? 1;
  const showPagination = !hasSearch && totalPages > 1;

  return (
    <div className="min-h-screen bg-[#FFF8F1] flex flex-col">

      <BakeryHeader data={data} router={router} />

      <BakerySearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        loading={inputLoading}
      />

      {!searchQuery && (
        <BakeryCategories
          categories={data.categories}
          active={activeCategory}
          setActive={setActiveCategory}
          setCurrentPage={setCurrentPage}
        />
      )}
      <LocationAlert
        show={!!locationError}
        message={locationError}
      />

      <BakeryItemCard
        key={`${safeCategory}-${currentPage}`}
        items={itemsToShow}
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
      />
      {showPagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
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