import { ArrowRight, Plus } from "lucide-react";

type Props = {
  whatsappUrl: string;
};

export default function CTASection({ whatsappUrl }: Props) {
    return (
        <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative overflow-hidden border-2 border-dashed border-slate-200 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center hover:border-[#00A7E1] hover:bg-white transition-all duration-500 min-h-[420px]"
        >

        <div className="absolute inset-0 bg-gradient-to-br from-[#00A7E1]/0 to-[#00A7E1]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10">

            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-8 group-hover:bg-[#00A7E1] transition-all duration-500">

            <Plus
                size={40}
                className="text-slate-400 group-hover:text-white transition-colors"
            />

            </div>

            <h3 className="text-3xl font-black text-[#002B5B] mb-4">
            Lleva Tu Negocio Online
            </h3>

            <p className="text-slate-500 leading-relaxed mb-8 max-w-sm">

            Moderniza la experiencia de tus clientes con una landing
            interactiva y un catálogo o menú digital conectado con WhatsApp.

            </p>

            <div className="inline-flex items-center gap-3 bg-[#002B5B] text-white px-6 py-4 rounded-2xl font-bold group-hover:bg-[#00A7E1] transition-all duration-300">

            Comenzar Ahora

            <ArrowRight size={18} />

            </div>

        </div>

        </a>
    );
}