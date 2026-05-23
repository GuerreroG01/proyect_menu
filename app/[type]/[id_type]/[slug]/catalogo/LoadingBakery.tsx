"use client";

import { motion } from "framer-motion";
import { Coffee } from "lucide-react";

export default function LoadingBakery() {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-[#FFF8F1]">

            <motion.div
                animate={{
                scale: [1, 1.12, 1],
                rotate: [0, 6, -6, 0],
                }}
                transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                }}
                className="w-16 h-16 bg-[#C97B2A] rounded-[2rem] flex items-center justify-center shadow-xl"
            >
                <Coffee className="text-white" size={28} />
            </motion.div>

            <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-[#8B5E3C] font-bold tracking-widest uppercase text-[10px]"
            >
                Horneando el menú...
            </motion.p>

            <motion.div
                className="mt-4 flex gap-1"
                initial="hidden"
                animate="show"
                variants={{
                hidden: {},
                show: {
                    transition: {
                    staggerChildren: 0.15,
                    repeat: Infinity,
                    },
                },
                }}
            >
                {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    variants={{
                    hidden: { opacity: 0.2, y: 0 },
                    show: {
                        opacity: [0.2, 1, 0.2],
                        y: [0, -4, 0],
                    },
                    }}
                    transition={{
                    duration: 1,
                    repeat: Infinity,
                    }}
                    className="w-2 h-2 bg-[#C97B2A] rounded-full"
                />
                ))}
            </motion.div>

        </div>
    );
}