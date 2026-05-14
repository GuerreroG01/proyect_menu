import Link from "next/link";
import { Utensils, MapPin, Clock, ArrowRight, Star, Info, ChevronLeft, ShieldCheck, Share2 } from "lucide-react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"] 
});

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ restaurant: string }>;
}) {
  const { restaurant } = await params;
  const displayName = restaurant.replace(/_/g, " ");

  return (
    <div className={`${montserrat.className} min-h-screen bg-[#FDFDFD] flex flex-col antialiased`}>
      {/* Hero Section con profundidad dinámica */}
      <div className="relative h-[48vh] w-full overflow-hidden bg-[#001529]">
        <img
          src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974&auto=format&fit=crop" 
          alt="Restaurant Hero"
          className="w-full h-full object-cover opacity-60 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDFDFD] via-transparent to-black/20" />
        
        {/* Barra superior de acciones */}
        <div className="absolute top-6 left-0 right-0 px-6 flex justify-between items-center z-30">
          <Link href="/" className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl text-white border border-white/20 hover:bg-white/20 transition-all shadow-lg">
            <ChevronLeft size={20} />
          </Link>
          <button className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl text-white border border-white/20 hover:bg-white/20 transition-all shadow-lg">
            <Share2 size={20} />
          </button>
        </div>

        {/* Badge Flotante "Abierto" */}
        <div className="absolute bottom-20 right-8 z-20">
          <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-100 shadow-xl flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Abierto ahora</span>
          </div>
        </div>

        {/* Logo con diseño de "Superellipse" */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20">
          <div className="w-32 h-32 bg-white rounded-[3rem] p-2 shadow-[0_30px_60px_-15px_rgba(0,43,91,0.25)] border border-slate-50">
            <div className="w-full h-full bg-gradient-to-br from-[#002B5B] to-[#001529] rounded-[2.6rem] flex items-center justify-center text-[#00A7E1] font-black text-4xl shadow-inner border border-blue-900/50">
              {displayName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-xl mx-auto w-full px-6 pt-24 pb-12 relative">
        
        {/* Título y Verificado */}
        <div className="text-center mb-10">
          <div className="flex justify-center items-center gap-1.5 mb-5">
             <div className="flex bg-[#00A7E1]/10 px-3 py-1 rounded-full border border-[#00A7E1]/20">
                <ShieldCheck size={14} className="text-[#00A7E1] mr-1.5" />
                <span className="text-[10px] font-black text-[#002B5B] uppercase tracking-[0.15em]">Socio Verificado</span>
             </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-900 text-[#002B5B] capitalize mb-6 tracking-tight leading-[0.85] drop-shadow-sm">
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

        {/* Bento Grid Info */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="group flex flex-col p-5 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all hover:shadow-md active:scale-95">
            <div className="w-10 h-10 bg-[#00A7E1] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-[#00A7E1]/20">
              <MapPin className="text-white" size={18} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Localización</span>
            <span className="text-sm text-[#002B5B] font-bold">Centro Histórico, Calle 5</span>
          </div>

          <div className="group flex flex-col p-5 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all hover:shadow-md active:scale-95">
            <div className="w-10 h-10 bg-[#002B5B] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-[#002B5B]/20">
              <Clock className="text-white" size={18} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Horario</span>
            <span className="text-sm text-[#002B5B] font-bold">Cierra a las 22:00</span>
          </div>
        </div>

        {/* Acción Principal Mejorada */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#00A7E1] to-[#002B5B] rounded-[2.8rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <Link
            href={`/${restaurant}/menu`}
            className="relative flex items-center justify-between pl-8 pr-4 w-full bg-[#002B5B] text-white py-6 rounded-[2.5rem] font-extrabold text-xl transition-all shadow-xl active:scale-[0.97]"
          >
            <div className="flex items-center gap-4">
              <Utensils size={24} className="text-[#00A7E1]" />
              <span className="tracking-tight uppercase">Explorar la Carta</span>
            </div>
            <div className="h-14 w-14 bg-[#00A7E1] rounded-[1.8rem] flex items-center justify-center text-white shadow-inner">
              <ArrowRight size={28} />
            </div>
          </Link>
        </div>

        {/* Footer info con más estilo */}
        <div className="mt-12 space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-2xl">
              <Info size={14} className="text-[#00A7E1]" />
              <p className="text-[10px] font-black text-slate-500 tracking-wider uppercase">
                Red Wi-Fi de alta velocidad disponible
              </p>
            </div>
            
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            
            <div className="flex flex-col items-center gap-1 opacity-40">
              <p className="text-[9px] font-black text-[#002B5B] uppercase tracking-[0.4em]">
                Desarrollado por
              </p>
              <span className="text-[11px] font-bold text-[#00A7E1]">LocalNet Systems v2.4</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}