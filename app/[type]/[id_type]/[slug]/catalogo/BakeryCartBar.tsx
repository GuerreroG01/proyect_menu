"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bike, Store, ArrowRight } from "lucide-react";

type Props = {
    totalItems: number;
    totalPrice: number;
    orderType: "local" | "delivery";
    setOrderType: (v: "local" | "delivery") => void;
    onConfirm: () => void;
};

export default function BakeryCartBar({
    totalItems,
    totalPrice,
    orderType,
    setOrderType,
    onConfirm,
}: Props) {
    if (!totalItems || totalItems <= 0) return null;

    const safeTotalPrice = Number(totalPrice || 0);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 120, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 120, opacity: 0 }}
                className="fixed bottom-5 inset-x-0 px-5 z-50"
            >
                <div className="max-w-md mx-auto">

                    <div
                        onClick={onConfirm}
                        className="
                            w-full cursor-pointer group relative overflow-hidden
                            rounded-[2.5rem]
                            bg-[#3A2E2A]
                            shadow-[0_20px_60px_rgba(0,0,0,0.25)]
                            border border-[#F2D6B3]/20
                            flex items-center justify-between px-5 py-4
                            active:scale-[0.99]
                            transition
                        "
                    >

                        <div className="
                            absolute inset-0 opacity-0 group-hover:opacity-100
                            transition-opacity
                            bg-[radial-gradient(circle_at_top_right,rgba(201,123,42,0.25),transparent_60%)]
                        " />

                        <div className="relative z-10 flex flex-col gap-3 text-left">

                            <div className="flex gap-2">

                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOrderType("local");
                                    }}
                                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                                        orderType === "local"
                                            ? "bg-[#C97B2A] text-white"
                                            : "bg-white/10 text-white/60"
                                    }`}
                                >
                                    <Store size={14} />
                                    Local
                                </div>

                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOrderType("delivery");
                                    }}
                                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                                        orderType === "delivery"
                                            ? "bg-[#C97B2A] text-white"
                                            : "bg-white/10 text-white/60"
                                    }`}
                                >
                                    <Bike size={14} />
                                    Delivery
                                </div>

                            </div>

                            <div className="flex items-end gap-2">
                                <span className="text-2xl font-black text-white">
                                    ${safeTotalPrice.toFixed(2)}
                                </span>

                                <span className="text-[10px] font-bold text-[#C97B2A]">
                                    ({totalItems} items)
                                </span>
                            </div>

                        </div>

                        <div className="relative z-10">
                            <div className="
                                flex items-center gap-2
                                bg-[#C97B2A]
                                px-5 py-3
                                rounded-[2rem]
                                font-black text-[11px] uppercase tracking-widest
                                shadow-[0_10px_30px_rgba(201,123,42,0.35)]
                                active:scale-95
                                transition
                            ">
                                Confirmar
                                <ArrowRight size={14} />
                            </div>
                        </div>

                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}