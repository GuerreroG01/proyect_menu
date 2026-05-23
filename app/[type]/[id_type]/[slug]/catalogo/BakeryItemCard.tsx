"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Plus, Minus, Coffee } from "lucide-react";

type Props = {
    items: any[];
    cart: Record<string, { quantity: number }>;
    addToCart: (item: any) => void;
    removeFromCart: (name: string) => void;
};

export default function BakeryItemList({
    items,
    cart,
    addToCart,
    removeFromCart,
}: Props) {

    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <>
            <main className="p-5 max-w-2xl mx-auto w-full flex-1 mb-32">
                <div className="grid gap-6">

                    <AnimatePresence>
                        {items?.filter(Boolean).map((item, i) => {
                            if (!item?.name) return null;

                            const quantity = cart?.[item.name]?.quantity || 0;

                            return (
                                <motion.div
                                    key={item.name}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="
                                        bg-white/80
                                        p-3
                                        rounded-[2.2rem]
                                        border border-[#F2D6B3]/60
                                        flex gap-4 items-center
                                        hover:shadow-md
                                        transition-all
                                    "
                                >

                                    <div className="h-24 w-24 rounded-[1.8rem] bg-[#FFF3E6] overflow-hidden relative flex-shrink-0">

                                        {item?.image ? (
                                            <img
                                                src={item.image}
                                                alt={item?.name || "item"}
                                                onClick={() => setSelectedImage(item.image)}
                                                className="
                                                    w-full h-full object-cover
                                                    cursor-pointer
                                                    hover:scale-105
                                                    transition-transform duration-200
                                                "
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Coffee size={28} className="text-[#C97B2A]/40" />
                                            </div>
                                        )}

                                        {quantity > 0 && (
                                            <div className="absolute inset-0 bg-[#C97B2A]/20 flex items-center justify-center">
                                                <div className="bg-[#C97B2A] text-white w-9 h-9 rounded-full flex items-center justify-center text-xs font-black shadow-lg ring-2 ring-white">
                                                    {quantity}
                                                </div>
                                            </div>
                                        )}

                                    </div>

                                    <div className="flex-1 pr-4">
                                        <h3 className="font-black text-[#3A2E2A] text-base">
                                            {item?.name}
                                        </h3>

                                        {item?.description && (
                                            <p className="text-[#8B5E3C] text-[11px] mt-1 line-clamp-2">
                                                {item.description}
                                            </p>
                                        )}

                                        <div className="mt-3 flex justify-between items-center">

                                            <span className="font-black text-[#3A2E2A] text-sm">
                                                ${Number(item?.price || 0).toFixed(2)}
                                            </span>

                                            {quantity > 0 ? (
                                                <div className="flex items-center bg-[#3A2E2A] rounded-2xl p-1 gap-2 shadow-sm">

                                                    <button
                                                        onClick={() => removeFromCart(item.name)}
                                                        className="w-8 h-8 flex items-center justify-center text-white hover:text-[#F2D6B3] transition"
                                                    >
                                                        <Minus size={14} />
                                                    </button>

                                                    <span className="text-white text-xs w-4 text-center font-bold">
                                                        {quantity}
                                                    </span>

                                                    <button
                                                        onClick={() => addToCart(item)}
                                                        className="w-8 h-8 flex items-center justify-center text-[#C97B2A] hover:text-[#F2D6B3] transition"
                                                    >
                                                        <Plus size={14} />
                                                    </button>

                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => addToCart(item)}
                                                    className="
                                                        bg-[#C97B2A]
                                                        text-white
                                                        px-4 py-2
                                                        rounded-xl
                                                        text-[10px]
                                                        font-black
                                                        uppercase
                                                        tracking-wider
                                                        shadow-sm
                                                        hover:brightness-110
                                                        transition
                                                    "
                                                >
                                                    Agregar
                                                </button>
                                            )}

                                        </div>
                                    </div>

                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                </div>
            </main>

            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5"
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.img
                            src={selectedImage}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className="max-w-3xl max-h-[80vh] rounded-2xl shadow-2xl object-contain border border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}