import { Globe } from "lucide-react";

export default function Navbar() {
    return (
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
    );
}