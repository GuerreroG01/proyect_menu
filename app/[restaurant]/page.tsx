import Link from "next/link";
import { Utensils, MapPin, Clock, ArrowRight, Star, ChevronLeft, ShieldCheck } from "lucide-react";
import { Montserrat } from "next/font/google";
import fs from "fs";
import path from "path";

const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"] 
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
}

// Configuración de Zona Horaria
const TIMEZONE = "America/Managua";

function verificarSiEstaAbierto(horarios: Horario[] | undefined): boolean {
  if (!horarios || horarios.length === 0) return false;
  
  const ahoraEnPunto = new Date().toLocaleString("en-US", { timeZone: TIMEZONE });
  const ahora = new Date(ahoraEnPunto);

  const numeroDia = ahora.getDay();
  const esFinDeSemana = numeroDia === 0 || numeroDia === 6;

  const horarioHoy = horarios.find(h => {
    const diasMinuscula = h.dias.toLowerCase();
    if (esFinDeSemana) {
      return (
        diasMinuscula.includes("sábado") || 
        diasMinuscula.includes("domingo") || 
        diasMinuscula.includes("fin de semana") ||
        diasMinuscula.includes("todos los días")
      );
    } else {
      return (
        diasMinuscula.includes("lunes") || 
        diasMinuscula.includes("viernes") || 
        diasMinuscula.includes("semana") ||
        diasMinuscula.includes("todos los días")
      );
    }
  }) || horarios[0];

  const stringAMinutos = (horaStr: string) => {
    const partes = horaStr.trim().split(/\s+/);
    if (partes.length < 2) return 0;

    const [horaMin, meridiano] = partes;
    let [horas, minutos] = horaMin.split(":").map(Number);
    
    const m = meridiano.toUpperCase();
    if (m === "PM" && horas < 12) horas += 12;
    if (m === "AM" && horas === 12) horas = 0;
    
    return horas * 60 + (minutos || 0);
  };

  const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();
  const minutosAbre = stringAMinutos(horarioHoy.abre);
  const minutosCierra = stringAMinutos(horarioHoy.cierra);

  if (minutosCierra < minutosAbre) {
    return minutosAhora >= minutosAbre || minutosAhora <= minutosCierra;
  }

  return minutosAhora >= minutosAbre && minutosAhora <= minutosCierra;
}

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ restaurant: string }>;
}) {
  const { restaurant } = await params;

  let restaurantData: RestaurantData | null = null;
  let fetchError = false;

  try {
    const filePath = path.join(process.cwd(), "public", "menus", `${restaurant}.json`);
    const fileContent = fs.readFileSync(filePath, "utf8");
    restaurantData = JSON.parse(fileContent);
  } catch (error) {
    console.error("Error cargando el archivo del restaurante:", error);
    fetchError = true;
  }

  const displayName = restaurantData?.name || restaurant.replace(/_/g, " ");
  const estaAbierto = verificarSiEstaAbierto(restaurantData?.horarios);

  return (
    <div className={`${montserrat.className} min-h-screen bg-[#FDFDFD] flex flex-col antialiased`}>
      <div className="relative h-[48vh] w-full overflow-hidden bg-[#001529]">
        <img
          src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974&auto=format&fit=crop" 
          alt="Restaurant Hero"
          className="w-full h-full object-cover opacity-60 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDFDFD] via-transparent to-black/20" />
        
        <div className="absolute top-6 left-0 right-0 px-6 flex justify-between items-center z-30">
          <Link href="/" className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl text-white border border-white/20 hover:bg-white/20 transition-all shadow-lg">
            <ChevronLeft size={20} />
          </Link>
        </div>

        <div className="absolute bottom-20 right-8 z-20">
          <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-100 shadow-xl flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              {estaAbierto ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              )}
            </span>
            <span className={`text-[10px] font-black uppercase tracking-wider ${estaAbierto ? 'text-slate-700' : 'text-rose-600'}`}>
              {estaAbierto ? "Abierto ahora" : "Cerrado"}
            </span>
          </div>
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20">
          <div className="w-32 h-32 bg-white rounded-[3rem] p-2 shadow-[0_30px_60px_-15px_rgba(0,43,91,0.25)] border border-slate-50">
            <div className="w-full h-full bg-gradient-to-br from-[#002B5B] to-[#001529] rounded-[2.6rem] flex items-center justify-center text-[#00A7E1] font-black text-4xl shadow-inner border border-blue-900/50">
              {displayName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-xl mx-auto w-full px-6 pt-24 pb-12 relative">
        <div className="text-center mb-10">
          <div className="flex justify-center items-center gap-1.5 mb-5">
             <div className="flex bg-[#00A7E1]/10 px-3 py-1 rounded-full border border-[#00A7E1]/20">
                <ShieldCheck size={14} className="text-[#00A7E1] mr-1.5" />
                <span className="text-[10px] font-black text-[#002B5B] uppercase tracking-[0.15em]">Socio Verificado</span>
             </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-[900] text-[#002B5B] capitalize mb-6 tracking-tight leading-[0.85] drop-shadow-sm">
            {displayName}
          </h1>
          
          <div className="flex justify-center items-center gap-4 mb-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-sm font-bold text-slate-500">4.9 (120+ reseñas)</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-10">
          <a 
            href={restaurantData?.ubicacion || "#"}
            target="_blank" 
            rel="noopener noreferrer"
            className={`group flex flex-col p-5 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all hover:shadow-md active:scale-95 ${
              restaurantData?.ubicacion ? "cursor-pointer" : "pointer-events-none opacity-60"
            }`}
          >
            <div className="w-10 h-10 bg-[#00A7E1] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-[#00A7E1]/20">
              <MapPin className="text-white" size={18} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Localización</span>
            <span className="text-sm text-[#002B5B] font-bold line-clamp-2">
              {restaurantData?.labelUbicacion || (fetchError ? "Dirección no disponible" : "Cargando...")}
            </span>
          </a>

          <div className="group flex flex-col p-5 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all hover:shadow-md active:scale-95">
            <div className="w-10 h-10 bg-[#002B5B] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-[#002B5B]/20">
              <Clock className="text-white" size={18} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Horario Hoy</span>
            <span className="text-sm text-[#002B5B] font-bold line-clamp-2">
              {(() => {
                if (!restaurantData?.horarios || restaurantData.horarios.length === 0) {
                  return fetchError ? "No disponible" : "Cargando...";
                }
                const ahoraEnPunto = new Date().toLocaleString("en-US", { timeZone: TIMEZONE });
                const ahora = new Date(ahoraEnPunto);
                const numeroDia = ahora.getDay();
                const esFinDeSemana = numeroDia === 0 || numeroDia === 6;

                const horarioHoy = restaurantData.horarios.find(h => {
                  const diasMinuscula = h.dias.toLowerCase();
                  if (esFinDeSemana) {
                    return diasMinuscula.includes("sábado") || diasMinuscula.includes("domingo") || diasMinuscula.includes("fin de semana") || diasMinuscula.includes("todos los días");
                  } else {
                    return diasMinuscula.includes("lunes") || diasMinuscula.includes("viernes") || diasMinuscula.includes("semana") || diasMinuscula.includes("todos los días");
                  }
                }) || restaurantData.horarios[0];

                return `${horarioHoy.abre} - ${horarioHoy.cierra}`;
              })()}
            </span>
          </div>
        </div>

        <div className="relative group">
          {estaAbierto && (
            <div className="absolute -inset-1 bg-gradient-to-r from-[#00A7E1] to-[#002B5B] rounded-[2.8rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          )}
          
          <Link
            href={`/${restaurant}/menu`}
            className={`relative flex items-center justify-between pl-8 pr-4 w-full py-6 rounded-[2.5rem] font-extrabold text-xl transition-all shadow-xl ${
              estaAbierto
                ? "bg-[#002B5B] text-white active:scale-[0.97] cursor-pointer"
                : "bg-slate-200 text-slate-400 pointer-events-none select-none shadow-none"
            }`}
          >
            <div className="flex items-center gap-4">
              <Utensils size={24} className={estaAbierto ? "text-[#00A7E1]" : "text-slate-400"} />
              <span className="tracking-tight uppercase">
                {estaAbierto ? "Explorar la Carta" : "Local Cerrado"}
              </span>
            </div>
            <div 
              className={`h-14 w-14 rounded-[1.8rem] flex items-center justify-center text-white shadow-inner ${
                estaAbierto ? "bg-[#00A7E1]" : "bg-slate-300"
              }`}
            >
              <ArrowRight size={28} />
            </div>
          </Link>
        </div>

        <div className="mt-12 space-y-6 text-center">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          <div className="opacity-40">
            <p className="text-[9px] font-black text-[#002B5B] uppercase tracking-[0.4em]">Desarrollado por</p>
            <span className="text-[11px] font-bold text-[#00A7E1]">LocalNet Systems</span>
          </div>
        </div>
      </main>
    </div>
  );
}