export default function Footer() {
    return (
        <footer className="mt-auto py-8 px-6 border-t border-slate-100 bg-white/80 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
                
                <div className="flex flex-col sm:items-start items-center gap-1">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        © 2026 LocalNet Systems
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                        Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}