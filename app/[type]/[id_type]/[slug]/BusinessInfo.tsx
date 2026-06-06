"use client";

import { useState, useEffect } from "react";
import { Images, ArrowUpRight, X, Maximize2 } from "lucide-react";
import { FaFacebook as Facebook, FaInstagram as Instagram } from "react-icons/fa";

interface BusinessInfoProps {
    whatsapp?: string;
    instagram?: string;
    facebook?: string;
    images?: string[];
    businessName: string;
}

export default function BusinessInfo({ instagram, facebook, images = [], businessName }: BusinessInfoProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    
    const hasSocials = instagram || facebook;
    const hasImages = images.length > 0;

    useEffect(() => {
        if (selectedImage) {
        document.body.style.overflow = 'hidden';
        } else {
        document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [selectedImage]);

    if (!hasSocials && !hasImages) return null;

    return (
        <div className="mt-10 space-y-8 border-t border-slate-100 pt-8 antialiased">
        
        {hasImages && (
            <div className="space-y-5">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-[#00A7E1]/10 rounded-xl text-[#00A7E1] shadow-sm ring-1 ring-[#00A7E1]/20">
                <Images size={18} className="animate-pulse" style={{ animationDuration: '3s' }} />
                </div>
                <div>
                <h3 className="text-sm font-semibold tracking-tight text-[#002B5B]">
                    Visita nuestro espacio acogedor
                </h3>
                <p className="text-[11px] font-medium text-slate-400">
                    Cada rincón de <span className="text-slate-600 font-semibold">{businessName}</span> está diseñado para tu comodidad
                </p>
                </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {images.map((imgUrl, index) => {
                const isFirst = index === 0;
                return (
                    <button
                    key={index}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`relative overflow-hidden bg-slate-50 border border-slate-200/40 group shadow-sm transition-all duration-500 ease-out rounded-2xl hover:shadow-md hover:border-slate-300/60 text-left focus:outline-none focus:ring-2 focus:ring-[#00A7E1]/40
                        ${isFirst ? "col-span-2 row-span-2 aspect-[4/3] sm:aspect-square" : "aspect-square"}`}
                    >
                    <img
                        src={imgUrl}
                        alt={`Ambiente de ${businessName} ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                        loading="lazy"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-500" />
                    
                    <div className="absolute top-3 right-3 p-1.5 bg-black/30 backdrop-blur-md rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 scale-95 group-hover:scale-100">
                        <Maximize2 size={12} />
                    </div>
                    
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/10 group-hover:ring-white/20 transition-all duration-500 rounded-2xl" />
                    </button>
                );
                })}
            </div>
            </div>
        )}

        {hasSocials && (
            <div className="space-y-4 bg-gradient-to-b from-slate-50/80 to-slate-50/30 p-5 rounded-2xl border border-slate-200/50 backdrop-blur-sm">
            <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                ¿Quieres ver más de nosotros?
            </h4>
            
            <div className="flex flex-wrap gap-3">
                {instagram && (
                <a
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gradient-to-r hover:from-rose-50 hover:to-orange-50/30 rounded-xl text-slate-600 hover:text-rose-600 text-xs font-semibold border border-slate-200/60 hover:border-rose-200/80 transition-all duration-300 active:scale-[0.98] shadow-xs hover:shadow-sm"
                >
                    <Instagram size={15} className="text-rose-500 transition-transform duration-300 group-hover:scale-110" />
                    <span>Instagram</span>
                    <ArrowUpRight size={13} className="text-slate-300 transition-all duration-300 group-hover:text-rose-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                )}

                {facebook && (
                <a
                    href={facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50/30 rounded-xl text-slate-600 hover:text-blue-600 text-xs font-semibold border border-slate-200/60 hover:border-blue-200/80 transition-all duration-300 active:scale-[0.98] shadow-xs hover:shadow-sm"
                >
                    <Facebook size={15} className="text-blue-500 transition-transform duration-300 group-hover:scale-110" />
                    <span>Facebook</span>
                    <ArrowUpRight size={13} className="text-slate-300 transition-all duration-300 group-hover:text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                )}
            </div>
            </div>
        )}

        {selectedImage && (
            <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
            onClick={() => setSelectedImage(null)}
            >
            <button 
                className="absolute top-4 right-4 p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-xs focus:outline-none focus:ring-2 focus:ring-white/40"
                onClick={() => setSelectedImage(null)}
            >
                <X size={20} />
            </button>
            
            <div 
                className="relative max-w-4xl max-h-[85vh] w-full h-full flex items-center justify-center animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <img
                src={selectedImage}
                alt="Detalle del espacio"
                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl border border-white/10"
                />
            </div>
            </div>
        )}

        </div>
    );
}