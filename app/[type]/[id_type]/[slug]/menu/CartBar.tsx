"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bike, Store, ShoppingBag, Utensils, ArrowRight } from "lucide-react";

type ActionType = "pedir" | "encargar" | null;
type DeliveryType = "local" | "delivery" | null;

type Props = {
  totalItems: number;
  totalPrice: number;
  actionType: ActionType;
  setActionType: (v: ActionType) => void;
  deliveryType: DeliveryType;
  setDeliveryType: (v: DeliveryType) => void;
  pickupDate: string;
  setPickupDate: (v: string) => void;
  pickupTime: string;
  setPickupTime: (v: string) => void;
  onConfirm: () => void;
};


export default function CartBar({
  totalItems, totalPrice, actionType, setActionType, deliveryType, setDeliveryType, pickupDate, setPickupDate, 
  pickupTime, setPickupTime, onConfirm
}: Props) {

  if (totalItems === 0) return null;

  const showDeliveryOptions = actionType !== null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y:120, opacity:0 }}
        animate={{ y:0, opacity:1 }}
        exit={{ y:120, opacity:0 }}
        className="
          fixed
          bottom-3
          sm:bottom-5
          inset-x-0
          px-3
          sm:px-5
          z-50
        "
      >
        <div className="max-w-md mx-auto">
          <div
            className="
              w-full
              rounded-[2rem]
              sm:rounded-[2.5rem]
              bg-gradient-to-br
              from-[#001B3D]
              via-[#002B5B]
              to-[#001B3D]
              shadow-[0_20px_60px_rgba(0,0,0,0.35)]
              border
              border-white/10
              flex
              flex-col
              gap-4
              px-4
              sm:px-5
              py-4
            "
          >
            <div className="flex flex-col gap-3">
              {!showDeliveryOptions && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setActionType("pedir")}
                    className="
                      flex-1
                      sm:flex-none
                      justify-center
                      flex
                      items-center
                      gap-1
                      px-3
                      py-2
                      rounded-full
                      text-[10px]
                      font-bold
                      bg-white/10
                      text-white/70
                      hover:bg-[#00A7E1]
                      hover:text-white
                      transition
                    "
                  >
                    <Utensils size={13}/>
                    Pedir
                  </button>
                  <button
                    onClick={() => setActionType("encargar")}
                    className="
                      flex-1
                      sm:flex-none
                      justify-center
                      flex
                      items-center
                      gap-1
                      px-3
                      py-2
                      rounded-full
                      text-[10px]
                      font-bold
                      bg-white/10
                      text-white/70
                      hover:bg-[#00A7E1]
                      hover:text-white
                      transition
                    "
                  >
                    <ShoppingBag size={13}/>
                    Encargar
                  </button>
                </div>
              )}
              {showDeliveryOptions && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setDeliveryType("local")}
                    className={`
                      flex-1
                      flex
                      justify-center
                      items-center
                      gap-1
                      px-3
                      py-2
                      rounded-full
                      text-[10px]
                      font-bold
                      transition

                      ${
                        deliveryType === "local"
                        ? "bg-[#00A7E1] text-white"
                        : "bg-white/10 text-white/60"
                      }
                    `}
                  >
                    <Store size={13}/>
                    Local
                  </button>
                  <button
                    onClick={() => setDeliveryType("delivery")}
                    className={`
                      flex-1
                      flex
                      justify-center
                      items-center
                      gap-1
                      px-3
                      py-2
                      rounded-full
                      text-[10px]
                      font-bold
                      transition
                      ${
                        deliveryType === "delivery"
                        ? "bg-[#00A7E1] text-white"
                        : "bg-white/10 text-white/60"
                      }
                    `}
                  >
                    <Bike size={13}/>
                    Domicilio
                  </button>
                </div>
              )}
              {actionType === "encargar" && deliveryType !== null && (
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-bold text-white/70 uppercase">
                    Fecha y hora del encargo
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={pickupDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e)=>setPickupDate(e.target.value)}
                      className="
                        w-full
                        bg-white/10
                        text-white
                        rounded-xl
                        px-3
                        py-2
                        text-xs
                        outline-none
                        border
                        border-white/10
                      "
                    />
                    <input
                      type="time"
                      value={pickupTime}
                      onChange={(e)=>setPickupTime(e.target.value)}
                      className="
                        w-full
                        bg-white/10
                        text-white
                        rounded-xl
                        px-3
                        py-2
                        text-xs
                        outline-none
                        border
                        border-white/10
                      "
                    />
                  </div>
                </div>
              )}
              <div
                className="
                  flex
                  flex-col
                  sm:flex-row
                  sm:items-center
                  justify-between
                  gap-3
                "
              >
                <div className="flex items-end gap-2">
                  <span
                    className="
                      text-xl
                      sm:text-2xl
                      font-black
                      text-white
                    "
                  >
                    ${totalPrice.toFixed(2)}
                  </span>
                  <span className="text-[10px] font-bold text-[#00A7E1]">
                    ({totalItems} productos)
                  </span>
                </div>
                <button
                  onClick={onConfirm}
                  disabled={
                    !actionType ||
                    !deliveryType ||
                    (actionType === "encargar" && (!pickupDate || !pickupTime))
                  }
                  className="
                    w-full
                    sm:w-auto
                    flex
                    justify-center
                    items-center
                    gap-2
                    bg-[#00A7E1]
                    px-5
                    py-3
                    rounded-[2rem]
                    font-black
                    text-[11px]
                    uppercase
                    tracking-widest
                    disabled:opacity-40
                    transition
                  "
                >
                  Confirmar
                  <ArrowRight size={14}/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}