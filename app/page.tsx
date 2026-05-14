import Link from "next/link";
import { Store, ArrowRight, LayoutGrid, Plus, Globe, Settings, Users } from "lucide-react";
// Importamos Montserrat para igualar la tipografía del logo
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"] 
});

export default function Home() {
  const restaurants = [
    { id: "la_fogata", name: "La Fogata", icon: "🍔", category: "Hamburguesas & Grill", status: "Online" },
    { id: "asados-juan", name: "Asados Juan", icon: "🥩", category: "Carnes a la brasa", status: "Online" },
  ];

  // Configuración de WhatsApp
  const whatsappNumber = "50586571443";
  const whatsappMessage = "Hola, me gustaría tener mi menú en la nube, quiero saber más información";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className={`${montserrat.className} min-h-screen bg-slate-50 flex flex-col text-slate-900`}>
      
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-[#002B5B] p-2.5 rounded-xl shadow-lg shadow-blue-100">
              <Globe className="text-[#00A7E1]" size={20} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-bold tracking-tight text-[#00A7E1]">
                LocalNet
              </span>
              <span className="text-lg font-medium text-[#002B5B] -mt-1">
                Systems
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6 md:p-12 w-full">
        
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl font-[900] text-[#002B5B] mb-3 tracking-tight">
              Mis Negocios
            </h1>
            <p className="text-slate-400 text-lg font-medium max-w-md">
              Gestiona el ecosistema digital de tus establecimientos desde un solo lugar.
            </p>
          </div>
          
          <div className="flex gap-3">
             <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm text-center">
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Activos</p>
                <p className="text-2xl font-black text-[#002B5B]">{restaurants.length}</p>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurants.map((res) => (
            <Link
              key={res.id}
              href={`/${res.id}`}
              className="group relative bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[5rem] -mr-10 -mt-10 group-hover:bg-blue-50 transition-colors duration-500" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-8">
                  <div className="text-4xl bg-white w-20 h-20 flex items-center justify-center rounded-3xl shadow-lg border border-slate-50 group-hover:scale-110 transition-transform duration-500">
                    {res.icon}
                  </div>
                  <span className="flex items-center gap-1.5 bg-green-50 text-green-600 text-[10px] font-bold uppercase px-3 py-1 rounded-full border border-green-100">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    {res.status}
                  </span>
                </div>

                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-[#002B5B] mb-2 group-hover:text-[#00A7E1] transition-colors">
                    {res.name}
                  </h2>
                  <p className="text-slate-400 text-sm mb-8 flex items-center gap-2 font-medium">
                    <LayoutGrid size={16} className="text-[#00A7E1]" />
                    {res.category}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center">
                        <Users size={12} className="text-slate-400" />
                      </div>
                    ))}
                  </div>
                  <div className="bg-[#002B5B] p-3 rounded-2xl text-white group-hover:bg-[#00A7E1] transition-all group-hover:translate-x-1">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {/* Botón convertido en Link de WhatsApp */}
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative group overflow-hidden border-2 border-dashed border-slate-200 p-8 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-slate-300 hover:border-[#00A7E1] hover:text-[#00A7E1] transition-all duration-300 bg-transparent hover:bg-white"
          >
            <div className="p-5 bg-slate-100 rounded-full group-hover:bg-[#00A7E1] group-hover:text-white transition-all duration-300">
              <Plus size={32} />
            </div>
            <div className="text-center">
               <span className="font-bold text-lg block text-slate-400 group-hover:text-[#00A7E1]">Añadir Negocio</span>
            </div>
          </a>
        </div>
      </main>

      <footer className="mt-auto py-10 px-6 border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
            © 2026 LocalNet Systems
          </p>
        </div>
      </footer>
    </div>
  );
}