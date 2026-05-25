"use client";

type LoadingOverlayProps = {
    message?: string;
    size?: "sm" | "md";
};

export default function LoadingOverlay({ message = "Cargando...", size = "sm" }: LoadingOverlayProps) {
    const spinnerSize = size === "sm" ? "w-12 h-12" : "w-16 h-16";

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-2xl">
            <div className="flex flex-col items-center gap-3">

                <div className={`relative ${spinnerSize}`}>
                <div className="absolute inset-0 rounded-full border border-[#00A7E1]/20" />
                <div className="absolute inset-0 rounded-full border-t-2 border-[#00A7E1] border-r-[#002B5B] animate-spin" />
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[#002B5B] to-[#00A7E1] animate-pulse" />
                </div>

                <p className="text-xs font-semibold text-[#002B5B] animate-pulse">
                    {message}
                </p>
            </div>
        </div>
    );
}