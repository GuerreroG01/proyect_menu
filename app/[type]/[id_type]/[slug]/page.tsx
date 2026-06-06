import Link from "next/link";
import { MapPin, Star, ChevronLeft, ShieldCheck } from "lucide-react";
import { Montserrat } from "next/font/google";
import { getBusiness } from "@/app/lib/data";
import HorariosModal from "./HorariosModal";
import VerButton from "./VerButton";
import ShareButton from "./ShareButton";
import { Metadata } from "next";
import BusinessInfo from "./BusinessInfo";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

interface Horario {
  dias: string;
  abre: string;
  cierra: string;
}

interface RestaurantData {
  name: string;
  logo: string;
  whatsapp: string;
  labelUbicacion: string;
  ubicacion: string;
  horarios: Horario[];
  categories: any[];
  QR_URL?: string;
  type: string;
  instagram?: string;
  facebook?: string;
  images?: string[];
}

const TIMEZONE = "America/Managua";
const TYPE_CONFIG: Record<string, { label: string; route: string; folder: string; banner: string }> = {
  "1": {
    label: "Menú",
    route: "menu",
    folder: "menus",
    banner: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974&auto=format&fit=crop",
  },
  "2": {
    label: "Catálogo",
    route: "catalogo",
    folder: "catalogos",
    banner: "https://wallpapers.com/images/hd/bakery-sweet-delicacies-4yybowlofjci72ik.jpg",
  },
  "3": {
    label: "Catálogo",
    route: "tienda",
    folder: "tiendas",
    banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
};

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ type: string; id_type: string; slug: string }>; 
}): Promise<Metadata> {
  const { type, id_type, slug } = await params;

  const config = TYPE_CONFIG[id_type] ?? TYPE_CONFIG["1"];
  const folder = config.folder;

  const restaurantData = getBusiness(folder, slug);
  const name = restaurantData?.name || slug.replace(/_/g, " ");
  
  const shareUrl = `https://proyect-menu.vercel.app/${type}/${id_type}/${slug}`;

  return {
    title: `${name} | LocalNet Systems`,
    description: `Explora el ${config.label.toLowerCase()} digital de ${name}.`,
    openGraph: {
      title: name,
      description: `Explora nuestro ${config.label.toLowerCase()} interactivo en línea.`,
      url: shareUrl,
      siteName: "LocalNet Systems",
      type: "website",
      images: [
        {
          url: config.banner,
          width: 1200,
          height: 630,
          alt: `Catálogo de ${name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description: `Explora el ${config.label.toLowerCase()} digital de ${name}.`,
      images: [config.banner],
    },
  };
}

function verificarSiEstaAbierto(horarios: Horario[] = []): boolean {
  if (!horarios.length) return false;

  const ahora = new Date(
    new Date().toLocaleString("en-US", { timeZone: TIMEZONE })
  );

  const dia = ahora.getDay();
  const esFindes = dia === 0 || dia === 6;

  const horarioHoy =
    horarios.find((h) => {
      const d = h.dias.toLowerCase();
      return esFindes
        ? d.includes("sábado") ||
          d.includes("domingo") ||
          d.includes("fin de semana") ||
          d.includes("todos los días")
        : d.includes("lunes") ||
          d.includes("viernes") ||
          d.includes("semana") ||
          d.includes("todos los días");
    }) || horarios[0];

  const toMin = (h: string) => {
    const [time, mer] = h.split(/\s+/);
    let [hh, mm] = time.split(":").map(Number);
    const m = mer?.toUpperCase();

    if (m === "PM" && hh < 12) hh += 12;
    if (m === "AM" && hh === 12) hh = 0;

    return hh * 60 + (mm || 0);
  };

  const now = ahora.getHours() * 60 + ahora.getMinutes();
  const open = toMin(horarioHoy.abre);
  const close = toMin(horarioHoy.cierra);

  return close < open
    ? now >= open || now <= close
    : now >= open && now <= close;
}

export default async function Page({ params }: { params: Promise<{ type: string; id_type: string; slug: string; }>; }) {
  const { type, id_type, slug } = await params;

  const config = TYPE_CONFIG[id_type] ?? TYPE_CONFIG["1"];
  const folder = config.folder;

  const restaurantData = getBusiness(folder, slug);
  const name = restaurantData?.name || slug.replace(/_/g, " ");

  const open = verificarSiEstaAbierto(restaurantData?.horarios);

  return (
    <div className={`${montserrat.className} min-h-screen bg-[#F8FAFC]`}>

      {/* BANNER SUPERIOR */}
      <div className="relative h-[28vh] w-full overflow-hidden">
        <img
          src={config.banner}
          className="w-full h-full object-cover"
          alt="Banner"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute top-4 left-4 flex items-center gap-2">
          <Link href="/" className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-white block transition-colors">
            <ChevronLeft size={18} />
          </Link>
          
          <ShareButton title={name} />
        </div>

        <div className="absolute top-4 right-4">
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold backdrop-blur-md ${
              open ? "bg-emerald-500/20 text-emerald-200" : "bg-red-500/20 text-red-200"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${open ? "bg-emerald-400" : "bg-red-400"}`} />
            {open ? "Abierto ahora" : "Cerrado"}
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-white/90 text-[#002B5B] text-[11px] font-bold shadow">
            <ShieldCheck size={14} className="text-[#00A7E1]" />
            Socio Verificado
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL: GRID REESTRUCTURADO */}
      {/* CONTENIDO PRINCIPAL REESTRUCTURADO */}
<main className="max-w-6xl mx-auto px-6 py-6 space-y-10">

  {/* SECCIÓN SUPERIOR: Rejilla de 2 columnas para la Info Esencial y el QR */}
  <div className="grid lg:grid-cols-2 gap-8 items-start">
    
    {/* COLUMNA IZQUIERDA: Información Esencial del Negocio */}
    <div className="space-y-4 h-fit">
      <h1 className="text-3xl md:text-4xl font-black text-[#002B5B] leading-tight">
        {name}
      </h1>

      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
        ))}
      </div>

      <a
        href={restaurantData?.ubicacion || "#"}
        className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm hover:bg-slate-50 transition-colors"
      >
        <MapPin className="text-[#00A7E1]" />
        <div>
          <p className="text-xs text-slate-400">Ubicación</p>
          <p className="font-bold text-[#002B5B] text-sm">
            {restaurantData?.labelUbicacion}
          </p>
        </div>
      </a>

      <HorariosModal horarios={restaurantData?.horarios || []} businessName={name} />

      <VerButton
        href={`/${type}/${id_type}/${slug}/${config.route}`}
        label={config.label}
      />
    </div>

    {/* COLUMNA DERECHA: Tarjeta del QR Code */}
    <div className="h-fit flex flex-col items-center lg:items-stretch">
      {restaurantData?.QR_URL && (
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center w-full max-w-sm mx-auto lg:max-w-none">
          <p className="text-xs uppercase tracking-widest text-slate-400 mb-4">
            Escanea el {config.label.toLowerCase()}
          </p>

          <img
            src={restaurantData.QR_URL}
            className="w-56 h-56 mx-auto bg-white p-2 rounded-2xl border"
            alt="QR Code"
          />

          <p className="text-xs text-slate-400 mt-4">
            Abre la cámara de tu teléfono
          </p>
        </div>
      )}
    </div>

  </div>

  {/* SECCIÓN INFERIOR INDEPENDIENTE: Ocupa todo el ancho del contenedor por sí misma */}
  <div className="w-full">
    <BusinessInfo 
      whatsapp={restaurantData?.whatsapp}
      instagram={restaurantData?.instagram}
      facebook={restaurantData?.facebook}
      images={restaurantData?.images}
      businessName={name}
    />
  </div>

</main>

      <div className="text-center text-xs text-slate-400 pb-6 mt-8">
        LocalNet Systems
      </div>
    </div>
  );
}