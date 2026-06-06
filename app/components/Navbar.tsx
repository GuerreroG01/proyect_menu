import logo from "../icon.ico";

export default function Navbar() {
    return (
        /* - bg-white/90 + backdrop-blur-md: Mantiene el blanco brillante pero deja pasar sutilmente las formas de fondo al hacer scroll.
          - max-w-7xl: Lo alineamos con el ancho del contenido principal (main) de tu página para una simetría perfecta.
        */
        <nav className="bg-white/90 backdrop-blur-md border-b border-slate-100/80 px-6 py-4 sticky top-0 z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto flex justify-between items-center">

                {/* Contenedor del Branding con una sutil micro-interacción al pasar el cursor */}
                <div className="flex items-center gap-3.5 group cursor-pointer">
                    
                    {/* Contenedor del Logo con un leve efecto de elevación y rotación */}
                    <div className="relative flex items-center justify-center p-1 rounded-xl bg-slate-50 border border-slate-100 group-hover:scale-105 group-hover:border-[#00A7E1]/30 transition-all duration-300">
                        <img
                            src={logo.src}
                            alt="LocalNet Systems Logo"
                            width={42}
                            height={42}
                            className="object-contain"
                        />
                    </div>

                    {/* Textos del Branding optimizados en jerarquía y espaciado */}
                    <div className="flex flex-col justify-center">
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-black tracking-tight text-[#002B5B] group-hover:text-[#00A7E1] transition-colors duration-300">
                                LocalNet
                            </span>
                            <span className="text-xs uppercase tracking-widest font-extrabold text-[#00A7E1]">
                                Systems
                            </span>
                        </div>
                    </div>
                    

                </div>

                {/* Nota: Aquí puedes añadir futuros enlaces de navegación en el lado derecho si lo deseas */}

            </div>
        </nav>
    );
}