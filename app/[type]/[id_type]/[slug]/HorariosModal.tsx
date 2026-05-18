"use client";

import { useState } from "react";
import { Clock, X, Calendar, ChevronRight, AlertTriangle, MessageCircle } from "lucide-react";
import { getHorariosFeriadosWhatsAppUrl } from "../../../lib/whatsapp";

interface Horario {
    dias: string;
    abre: string;
    cierra: string;
}

interface HorariosModalProps {
    horarios: Horario[];
    businessName?: string;
}

export default function HorariosModal({ horarios = [], businessName = "el local" }: HorariosModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    const urlWhatsAppFeriados = getHorariosFeriadosWhatsAppUrl(businessName);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl shadow-[0_2px_8px_rgba(15,23,42,0.04)] text-left hover:bg-slate-50 border border-slate-100 transition-all duration-200 active:scale-[0.99] group"
            >
                <div className="p-2.5 bg-[#002B5B]/5 text-[#002B5B] rounded-xl group-hover:bg-[#00A7E1]/10 group-hover:text-[#00A7E1] transition-colors duration-300">
                <Clock size={20} className="group-hover:rotate-12 transition-transform duration-300" />
                </div>
                
                <div className="flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Horario</p>
                <p className="font-extrabold text-sm text-[#002B5B] mt-0.5">
                    {horarios[0]?.abre || "Cerrado"} - {horarios[0]?.cierra || "Cerrado"}
                </p>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-[#00A7E1] bg-[#00A7E1]/8 px-3 py-1.5 rounded-xl group-hover:bg-[#00A7E1]/15 transition-all duration-200">
                <span>Ver todos</span>
                <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
                <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

                <div className="relative bg-white rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] w-full max-w-sm z-10 transform animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out flex flex-col overflow-hidden">
                    
                    <div className="p-6 pb-4">
                    <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-[#00A7E1]/10 text-[#00A7E1] rounded-xl">
                            <Calendar size={20} />
                        </div>
                        <div>
                            <h3 className="font-black text-lg text-[#002B5B] tracking-tight">Horarios</h3>
                            <p className="text-xs text-slate-400 font-medium">Días de atención al cliente</p>
                        </div>
                        </div>
                        
                        <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100 hover:text-slate-600 active:scale-90 transition-all duration-150"
                        >
                        <X size={16} />
                        </button>
                    </div>

                    <div className="space-y-2.5 max-h-[28vh] overflow-y-auto pr-1">
                        {horarios.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 hover:bg-slate-50 border border-slate-100 transition-colors"
                        >
                            <span className="font-bold text-sm text-slate-700">{item.dias}</span>
                            <span className="font-extrabold text-xs text-[#002B5B] bg-white px-3 py-1.5 rounded-xl border border-slate-200/60 shadow-[0_2px_4px_rgba(0,0,0,0.02)] tracking-wide">
                            {item.abre} - {item.cierra}
                            </span>
                        </div>
                        ))}
                    </div>
                    </div>

                    <div className="bg-slate-50 p-6 pt-5 border-t border-slate-100/80 space-y-4 flex flex-col items-center">
                    <div className="flex gap-2.5 items-start">
                        <AlertTriangle size={15} className="text-amber-500 shrink-0 mt-0.5 animate-pulse" />
                        <p className="text-xs font-medium text-slate-500 leading-relaxed">
                        En <span className="font-bold text-slate-700">días feriados</span> el horario puede variar. ¿Tienes dudas? Consulta directo al local.
                        </p>
                    </div>
                    
                    <a
                        href={urlWhatsAppFeriados}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2.5 w-full py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-lg shadow-green-600/10 transition-all duration-200 active:scale-[0.98]"
                    >
                        <MessageCircle size={16} className="fill-white/10" />
                        Consultar por WhatsApp
                    </a>

                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors pt-1"
                    >
                        Volver
                    </button>
                    </div>

                </div>
                </div>
            )}
        </>
    );
}