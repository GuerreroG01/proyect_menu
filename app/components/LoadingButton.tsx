"use client";

type LoadingOverlayProps = {
    message?: string;
};

export default function LoadingButton({
  message = "Cargando...",
}: LoadingOverlayProps) {
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-[#002B5B]/95 rounded-2xl">
            <div className="flex items-center gap-3">

                {/* spinner premium igual al tuyo */}
                <div className="relative w-5 h-5">
                <div className="absolute inset-0 rounded-full border border-white/30" />
                <div className="absolute inset-0 rounded-full border-t-2 border-white animate-spin" />
                <div className="absolute inset-1 rounded-full bg-white/10 animate-pulse" />
                </div>

                <span className="text-sm font-semibold text-white animate-pulse">
                {message}
                </span>

            </div>
        </div>
    );
}