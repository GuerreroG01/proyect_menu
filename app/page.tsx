import { Montserrat } from "next/font/google";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FeatureCard from "./components/FeatureCard";
import CTASection from "./components/CTASection";

import { features } from "./data/features";
import { getRestaurants } from "./lib/restaurants";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export default function Home() {
  const restaurants = getRestaurants();
  const totalActivos = restaurants.length;

  const whatsappNumber = "50586571443";

  const whatsappMessage =
    "Hola, me gustaría tener mi restaurante en la nube y conocer más información.";

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div
      className={`${montserrat.className} min-h-screen bg-slate-50 flex flex-col text-slate-900`}
    >
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-5 w-full">

        <section className="mb-24 flex flex-col lg:flex-row lg:items-end justify-between gap-12">

          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 bg-[#00A7E1]/10 border border-[#00A7E1]/10 text-[#00A7E1] px-4 py-2 rounded-full text-sm font-bold mb-8">
              <div className="w-2 h-2 rounded-full bg-[#00A7E1] animate-pulse" />
              Plataforma Digital para Restaurantes
            </div>

            <h1 className="text-5xl md:text-6xl xl:text-7xl font-black text-[#002B5B] leading-[1.05] tracking-tight mb-8">
              Lleva tu restaurante
              <span className="block text-[#00A7E1]">a la nube</span>
            </h1>

            <p className="text-slate-500 text-lg md:text-xl leading-relaxed max-w-2xl">
              Creamos una landing page interactiva para tu restaurante con menú digital,
              pedidos por WhatsApp, horarios dinámicos y presencia online optimizada.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#002B5B] hover:bg-[#001f42] text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-[1.02] shadow-lg text-center"
              >
                Solicitar Información
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-5 min-w-[260px]">

            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.3em] text-slate-300 font-bold mb-3">
                Restaurantes
              </p>

              <h3 className="text-5xl font-black text-[#002B5B]">
                {totalActivos}
              </h3>

              <p className="text-slate-400 mt-2 font-medium">
                En la plataforma
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#002B5B] to-[#003b7d] p-8 rounded-[2rem] text-white shadow-xl">
              <p className="text-sm uppercase tracking-[0.3em] text-[#00A7E1] font-bold mb-3">
                Experiencia
              </p>

              <h3 className="text-4xl font-black mb-2">
                Mobile First
              </h3>

              <p className="text-blue-100">
                Diseñado para clientes desde cualquier celular.
              </p>
            </div>

          </div>

        </section>

        <section
          id="features"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}

          <CTASection whatsappUrl={whatsappUrl} />
        </section>

        <section className="mt-28">
          <div className="flex items-end justify-between mb-10">
            <h2 className="text-3xl font-black text-[#002B5B]">
              Restaurantes asociados
            </h2>

            <a
              href="/catalogo"
              className="text-[#00A7E1] font-bold hover:underline"
            >
              Ver catálogo completo →
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {restaurants.slice(0, 3).map((r) => (
              <a
                key={r.id}
                href={`/${r.id}`}
                className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg transition"
              >
                <div className="text-3xl mb-3">{r.icon}</div>
                <h3 className="font-bold text-[#002B5B]">{r.name}</h3>
                <p className="text-slate-400 text-sm">{r.category}</p>
              </a>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}