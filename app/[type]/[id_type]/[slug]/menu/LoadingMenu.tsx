"use client";

import { motion } from "framer-motion";
import { Utensils } from "lucide-react";

export default function LoadingMenu() {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-white">
            <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-16 h-16 bg-[#00A7E1] rounded-[2rem] flex items-center justify-center shadow-xl shadow-blue-100"
            >
                <Utensils className="text-white" size={32} />
            </motion.div>

            <p className="mt-6 text-slate-400 font-bold tracking-widest uppercase text-[10px]">
                Preparando el Menú
            </p>
        </div>
    );
}