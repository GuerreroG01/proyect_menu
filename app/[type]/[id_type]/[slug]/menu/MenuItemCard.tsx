"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Utensils, X } from "lucide-react";

export default function MenuItemCard({
    item,
    quantity,
    addToCart,
    removeFromCart,
    index,
}: any) {
    const [openImage, setOpenImage] = useState(false);

    return (
        <>
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group bg-white p-2 rounded-[2.5rem] shadow-sm border border-slate-100 flex gap-4 items-center hover:shadow-md transition-all"
        >
            <div
                className="h-24 w-24 rounded-[2rem] bg-slate-50 overflow-hidden flex-shrink-0 relative cursor-pointer"
                onClick={() => item.image && setOpenImage(true)}
            >
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                        <Utensils size={32} />
                    </div>
                )}

                {quantity > 0 && (
                    <div className="absolute inset-0 bg-[#00A7E1]/20 backdrop-blur-[2px] flex items-center justify-center">
                        <div className="bg-[#00A7E1] text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shadow-lg">
                            {quantity}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-1 pr-4">
                <h3 className="font-black text-slate-800 text-base leading-tight">
                    {item.name}
                </h3>

                {item.description && (
                    <p className="text-slate-400 text-[11px] mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                    </p>
                )}

                <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-black text-slate-900 tracking-tighter">
                    ${item.price.toFixed(2)}
                    </span>

                    {quantity > 0 ? (
                    <div className="flex items-center bg-[#002B5B] rounded-2xl p-1 gap-2 shadow-lg">
                        <button
                        onClick={() => removeFromCart(item.name)}
                        className="w-8 h-8 flex items-center justify-center text-white hover:text-[#00A7E1] transition-colors"
                        >
                        <Minus size={14} />
                        </button>

                        <span className="font-black text-white text-xs w-4 text-center">
                            {quantity}
                        </span>

                        <button
                            onClick={() => addToCart(item)}
                            className="w-8 h-8 flex items-center justify-center bg-[#00A7E1] rounded-xl text-white"
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                    ) : (
                    <button
                        onClick={() => addToCart(item)}
                        className="bg-slate-50 text-slate-900 h-10 px-4 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest hover:bg-[#00A7E1] hover:text-white transition-all flex items-center gap-2 border border-slate-100"
                    >
                        Añadir <Plus size={12} />
                    </button>
                    )}
                </div>
            </div>
        </motion.div>

        <AnimatePresence>
            {openImage && item.image && (
            <motion.div
                className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpenImage(false)}
            >
                <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="relative max-w-lg w-full"
                onClick={(e) => e.stopPropagation()}
                >
                <button
                    onClick={() => setOpenImage(false)}
                    className="absolute -top-3 -right-3 bg-white text-slate-900 rounded-full p-2 shadow-lg"
                >
                    <X size={16} />
                </button>

                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full rounded-[2rem] shadow-2xl"
                />
                </motion.div>
            </motion.div>
            )}
        </AnimatePresence>
        </>
    );
}