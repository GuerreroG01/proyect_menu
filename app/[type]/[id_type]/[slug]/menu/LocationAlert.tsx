"use client";

import { motion, AnimatePresence } from "framer-motion";

type Props = {
    show: boolean;
    message: string;
};

export default function LocationAlert({ show, message }: Props) {
    return (
        <AnimatePresence>
        {show && (
            <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="
                fixed bottom-28 left-1/2 -translate-x-1/2 z-50
                w-[92%] max-w-sm
            "
            >
            <div
                className="
                relative overflow-hidden
                rounded-[2rem]
                border border-red-400/20
                bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#020617]
                shadow-[0_20px_60px_rgba(0,0,0,0.45)]
                backdrop-blur-xl
                px-5 py-4
                "
            >
                {/* Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.18),transparent_60%)]" />

                <div className="relative z-10 flex items-start gap-4">
                
                {/* Icon */}
                <div
                    className="
                    min-w-11 h-11 rounded-2xl
                    bg-red-500/15
                    border border-red-400/20
                    flex items-center justify-center
                    text-red-400 text-xl font-black
                    "
                >
                    !
                </div>

                {/* Content */}
                <div className="flex-1">
                    <h3 className="text-white font-black text-sm tracking-wide uppercase">
                    Ubicación requerida
                    </h3>

                    <p className="text-slate-300 text-sm leading-relaxed mt-1">
                    {message}
                    </p>
                </div>
                </div>
            </div>
            </motion.div>
        )}
        </AnimatePresence>
    );
}