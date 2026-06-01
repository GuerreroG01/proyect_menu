"use client";

import { useEffect, useState } from "react";

export default function ScrollToTopButton() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 300);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className={`
                fixed bottom-6 right-6 z-50
                w-12 h-12 rounded-2xl
                flex items-center justify-center
                
                /* Paleta de colores idéntica a tu Hero (Gradiente de marca) */
                bg-gradient-to-br from-[#002B5B] to-[#00A7E1]
                text-white
                
                /* Sombras suaves que combinan con tu bg-slate-50 */
                shadow-lg shadow-[#002B5B]/20
                
                /* Transición idéntica a tus botones principales (1.02 de escala) */
                transition-all duration-300 ease-out

                /* Estados Hover y Active sincronizados con tu diseño */
                hover:shadow-xl hover:shadow-[#00A7E1]/30
                hover:-translate-y-1
                hover:scale-[1.05]
                
                active:scale-95
                
                /* Animación de entrada y salida limpia */
                ${visible
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-4 scale-75 pointer-events-none"}
            `}
        >
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={2.5} 
                stroke="currentColor" 
                className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
            </svg>
        </button>
    );
}