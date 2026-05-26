"use client";

import { Bike, Store, ArrowRight } from "lucide-react";

interface CartBarProps {
    totalItems: number;
    totalPrice: number;
    orderType: "local" | "delivery";
    setOrderType: (type: "local" | "delivery") => void;
    onConfirm: () => void;
}

export default function CartBar({ totalItems, totalPrice, orderType, setOrderType, onConfirm }: CartBarProps) {
    if (totalItems === 0) return null;

    return (
        // Contenedor flotante con aislamiento neumático
        <div className="fixed bottom-4 left-0 right-0 z-50 px-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="max-w-xl mx-auto w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-slate-100 p-4 flex flex-col gap-4">
                
                {/* Selector de Entrega Segmentado */}
                <div className="flex bg-slate-100/70 p-1 rounded-2xl gap-1">
                    <button
                        onClick={() => setOrderType("delivery")}
                        className={`flex-1 py-2.5 text-[11px] font-bold tracking-widest uppercase rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${
                            orderType === "delivery" 
                                ? "bg-white text-slate-950 shadow-[0_4px_12px_rgba(0,0,0,0.04)] font-black" 
                                : "text-slate-400 hover:text-slate-600"
                        }`}
                    >
                        <Bike className={`w-3.5 h-3.5 transition-colors duration-300 ${orderType === "delivery" ? "text-slate-950" : "text-slate-400"}`} />
                        Envío
                    </button>
                    <button
                        onClick={() => setOrderType("local")}
                        className={`flex-1 py-2.5 text-[11px] font-bold tracking-widest uppercase rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${
                            orderType === "local" 
                                ? "bg-white text-slate-950 shadow-[0_4px_12px_rgba(0,0,0,0.04)] font-black" 
                                : "text-slate-400 hover:text-slate-600"
                        }`}
                    >
                        <Store className={`w-3.5 h-3.5 transition-colors duration-300 ${orderType === "local" ? "text-slate-950" : "text-slate-400"}`} />
                        Retiro
                    </button>
                </div>

                {/* Fila de Acción Principal */}
                <div className="flex justify-between items-center gap-4 pl-1">
                    {/* Bloque de Precio Minimalista */}
                    <div className="shrink-0">
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Total</p>
                        <p className="text-2xl font-black text-slate-950 tracking-tight font-mono">
                            ${totalPrice.toFixed(2)}
                        </p>
                    </div>

                    {/* Botón de Compra Monocromático de Alta Gama */}
                    <button
                        onClick={onConfirm}
                        className="flex-1 bg-slate-950 hover:bg-slate-900 active:scale-[0.98] text-white font-bold h-12 px-5 rounded-2xl text-xs tracking-widest uppercase flex items-center justify-between gap-3 transition-all duration-300 group shadow-lg shadow-slate-950/10"
                    >
                        <span className="font-extrabold">Confirmar Pedido</span>
                        
                        <div className="flex items-center gap-2 bg-white/10 pl-3 pr-2 py-1 rounded-xl transition-colors group-hover:bg-white/15">
                            <span className="font-black text-white/90 text-xs min-w-[14px] text-center">
                                {totalItems}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-white/70 transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                    </button>
                </div>
                
            </div>
        </div>
    );
}