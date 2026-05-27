"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Check } from "lucide-react";

type ProductItem = {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
    features?: {
        tallas?: string[];
        colores?: string[] | { name: string; hex: string }[];
    };
};

interface CardProps {
    item: ProductItem;
    quantity: number;
    addToCart: (item: any, selectedSize?: string, selectedColor?: string) => void;
    removeFromCart: (itemId: string) => void;
    index: number;
}

export default function StoreItemCard({ item, quantity, addToCart, removeFromCart, index }: CardProps) {
    const [selectedSize, setSelectedSize] = useState<string>("");
    const [selectedColor, setSelectedColor] = useState<string>("");
    const [showWarning, setShowWarning] = useState<boolean>(false);

    const hasSizes = item.features?.tallas && item.features.tallas.length > 0;
    const hasColors = item.features?.colores && item.features.colores.length > 0;
    const [expandedImage, setExpandedImage] = useState(false);
    const handleAdd = () => {
        if ((hasSizes && !selectedSize) || (hasColors && !selectedColor)) {
            setShowWarning(true);
            setTimeout(() => setShowWarning(false), 2000);
            return;
        }
        addToCart(item, selectedSize, selectedColor);
    };

    const isMissingSelection = (hasSizes && !selectedSize) || (hasColors && !selectedColor);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.04, ease: [0.215, 0.610, 0.355, 1.000] }}
            className="bg-white rounded-3xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100 flex gap-4 items-stretch relative overflow-hidden group hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-shadow duration-300"
        >
            {item.image && (
                <button
                    type="button"
                    onClick={() => setExpandedImage(true)}
                    className="w-24 h-32 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0 relative border border-slate-100 cursor-zoom-in"
                >
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {quantity > 0 && (
                        <div className="absolute top-1.5 right-1.5 bg-slate-950 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-in zoom-in-50 duration-200">
                            {quantity}
                        </div>
                    )}
                </button>
            )}

            <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
                <div>
                    <h3 className="font-bold text-slate-900 text-sm md:text-base truncate tracking-tight">{item.name}</h3>
                    {item.description && (
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed font-medium">
                            {item.description}
                        </p>
                    )}

                    <div className="flex flex-col gap-2 mt-3">
                        {hasSizes && (
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest min-w-[36px]">Talla:</span>
                                <div className="flex gap-1 flex-wrap">
                                    {item.features?.tallas?.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`text-[10px] min-w-[26px] h-6 px-1.5 rounded-lg border font-bold tracking-tight transition-all duration-200 ${
                                                selectedSize === size
                                                    ? "border-slate-950 bg-slate-950 text-white shadow-sm"
                                                    : "border-slate-200 text-slate-500 hover:text-slate-950 hover:border-slate-300 bg-white"
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {hasColors && (
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest min-w-[36px]">Color:</span>
                                <div className="flex gap-1.5 flex-wrap items-center">
                                    {item.features?.colores?.map((color: any) => {
                                        const colorName = typeof color === "string" ? color : color.name;
                                        const colorHex = typeof color === "object" && color.hex ? color.hex : null;
                                        const isSelected = selectedColor === colorName;

                                        return (
                                            <button
                                                key={colorName}
                                                onClick={() => setSelectedColor(colorName)}
                                                title={colorName}
                                                className={`transition-all duration-200 relative flex items-center justify-center ${
                                                    colorHex 
                                                        ? `w-5 h-5 rounded-full ring-1 ${isSelected ? 'ring-slate-950 ring-offset-2 scale-110' : 'ring-slate-200'}`
                                                        : `text-[10px] px-2 h-5 rounded-lg border font-bold ${
                                                            isSelected 
                                                                ? "border-slate-950 bg-slate-50 text-slate-950 font-extrabold" 
                                                                : "border-slate-200 text-slate-400 hover:text-slate-600 bg-white"
                                                          }`
                                                }`}
                                                style={colorHex ? { backgroundColor: colorHex } : {}}
                                            >
                                                {colorHex ? (
                                                    isSelected && <Check className="w-2.5 h-2.5 text-white mix-blend-difference drop-shadow-sm" strokeWidth={3} />
                                                ) : (
                                                    colorName
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-50">
                    <span className="font-black text-slate-950 text-base font-mono">${item.price.toFixed(2)}</span>

                    <div className="flex items-center gap-2">
                        <AnimatePresence mode="wait">
                            {quantity > 0 ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200/40"
                                >
                                    <button
                                        onClick={() => removeFromCart(item.id || item.name)}
                                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-950 transition-all"
                                    >
                                        <Minus className="w-3.5 h-3.5" strokeWidth={2.5} />
                                    </button>
                                    <span className="font-mono font-black text-xs text-slate-900 w-6 text-center">{quantity}</span>
                                    <button
                                        onClick={handleAdd}
                                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-950 transition-all"
                                    >
                                        <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.button
                                    onClick={handleAdd}
                                    className={`h-8 px-4 rounded-xl text-[11px] font-black tracking-widest uppercase transition-all duration-300 shadow-sm ${
                                        showWarning 
                                            ? "bg-rose-500 text-white animate-shake" 
                                            : isMissingSelection
                                                ? "bg-slate-50 border border-slate-200 text-slate-400 cursor-pointer hover:bg-slate-100 hover:text-slate-600"
                                                : "bg-slate-950 text-white hover:bg-slate-900 active:scale-95"
                                    }`}
                                >
                                    {showWarning ? "Elige Variante" : "Agregar"}
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {expandedImage && item.image && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setExpandedImage(false)}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <motion.img
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            src={item.image}
                            alt={item.name}
                            onClick={(e) => e.stopPropagation()}
                            className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
        
    );
}