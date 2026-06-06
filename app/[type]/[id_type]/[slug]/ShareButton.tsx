"use client";

import { Share2 } from "lucide-react";
import { useState, useEffect } from "react";

interface ShareButtonProps {
    title: string;
}

export default function ShareButton({ title }: ShareButtonProps) {
    const [canShare, setCanShare] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined" && "share" in navigator) {
        setCanShare(true);
        }
    }, []);

    const handleShare = async () => {
        if (!navigator.share) return;

        try {
        await navigator.share({
            title: title,
            text: `Encontré este lugar y creo que te va a gustar: ${title}`,
            url: window.location.href,
        });
        } catch (error) {
        if ((error as Error).name !== "AbortError") {
            console.error("Error al compartir:", error);
        }
        }
    };

    if (!canShare) return null;

  return (
    <div className="group relative inline-block">
        <button
            onClick={handleShare}
            type="button"
            className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-white flex items-center justify-center transition-all duration-200 active:scale-95"
        >
            <Share2 size={18} className="transition-transform group-hover:scale-110 duration-200" />
        </button>

        <div 
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 
                    bg-[#002B5B] text-white text-[11px] font-semibold tracking-wide rounded-md shadow-lg
                    pointer-events-none opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100
                    transition-all duration-200 ease-out z-50 whitespace-nowrap"
        >
            Compartir
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-[#002B5B]" />
        </div>
    </div>
  );
}