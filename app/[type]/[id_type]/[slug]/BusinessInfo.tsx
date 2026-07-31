"use client";

import { useState, useEffect } from "react";
import { Images, ArrowUpRight, X, Maximize2 } from "lucide-react";
import { FaFacebook as Facebook, FaInstagram as Instagram } from "react-icons/fa";

interface Gallery {
    type:
        | "business_photos"
        | "portfolio"
        | "products"
        | "services"
        | "team"
        | "none";
    title: string;
    description: string;
    images: string[];
}

interface BusinessInfoProps {
    instagram?: string;
    facebook?: string;
    gallery?: Gallery;
    businessName: string;
}

export default function BusinessInfo({
    instagram, facebook, gallery, businessName
}: BusinessInfoProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const hasSocials = Boolean(instagram || facebook);

    const hasGallery =
        gallery &&
        gallery.type !== "none" &&
        gallery.images.length > 0;

    useEffect(() => {
        document.body.style.overflow = selectedImage ? "hidden" : "unset";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [selectedImage]);

    if (!hasSocials && !hasGallery) return null;

    return (
        <div className="mt-10 space-y-8 border-t border-slate-100 pt-8 antialiased">
            {hasGallery && (
                <div className="space-y-5">
                    <div className="flex items-center gap-3">

                        <div className="
                            p-2 
                            bg-[#00A7E1]/10 
                            rounded-xl 
                            text-[#00A7E1]
                            shadow-sm
                            ring-1 
                            ring-[#00A7E1]/20
                        ">
                            <Images 
                                size={18}
                                className="animate-pulse"
                                style={{
                                    animationDuration:"3s"
                                }}
                            />
                        </div>

                        <div>
                            <h3 className="
                                text-sm 
                                font-semibold 
                                tracking-tight 
                                text-[#002B5B]
                            ">
                                {gallery.title}
                            </h3>
                            <p className="
                                text-[11px]
                                font-medium
                                text-slate-400
                            ">
                                {gallery.description}
                            </p>
                        </div>
                    </div>
                    <div className="
                        grid 
                        grid-cols-2 
                        sm:grid-cols-3 
                        gap-3.5
                    ">
                        {gallery.images.map((imgUrl,index)=>{
                            const isFirst=index===0;
                            return (
                                <button
                                    key={imgUrl}
                                    onClick={()=>
                                        setSelectedImage(imgUrl)
                                    }
                                    className={`
                                        relative
                                        overflow-hidden
                                        bg-slate-50
                                        border
                                        border-slate-200/40
                                        group
                                        shadow-sm
                                        transition-all
                                        duration-500
                                        rounded-2xl
                                        hover:shadow-md
                                        hover:border-slate-300/60
                                        ${
                                            isFirst
                                            ?
                                            "col-span-2 row-span-2 aspect-[4/3] sm:aspect-square"
                                            :
                                            "aspect-square"
                                        }
                                    `}
                                >
                                    <img
                                        src={imgUrl}
                                        alt={`${gallery.title} ${index+1}`}
                                        className="
                                            w-full
                                            h-full
                                            object-cover
                                            transition-transform
                                            duration-700
                                            group-hover:scale-103
                                        "
                                        loading="lazy"
                                    />
                                    <div className="
                                        absolute
                                        inset-0
                                        bg-gradient-to-t
                                        from-black/40
                                        via-black/0
                                        to-transparent
                                        opacity-80
                                        group-hover:opacity-40
                                        transition-opacity
                                    "/>
                                    <div className="
                                        absolute
                                        top-3
                                        right-3
                                        p-1.5
                                        bg-black/30
                                        backdrop-blur-md
                                        rounded-lg
                                        text-white
                                        opacity-0
                                        group-hover:opacity-100
                                    ">
                                        <Maximize2 size={12}/>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}
            {hasSocials && (
                <div className="
                    space-y-4
                    bg-gradient-to-b
                    from-slate-50/80
                    to-slate-50/30
                    p-5
                    rounded-2xl
                    border
                    border-slate-200/50
                ">
                    <h4 className="
                        text-[10px]
                        uppercase
                        tracking-widest
                        text-slate-400
                        font-bold
                    ">
                        ¿Quieres ver más de nosotros?
                    </h4>
                    <div className="flex flex-wrap gap-3">
                        {instagram && (
                            <a
                                href={instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    px-4
                                    py-2.5
                                    bg-white
                                    rounded-xl
                                    text-xs
                                    font-semibold
                                    border
                                    border-slate-200/60
                                "
                            >
                                <Instagram
                                    size={15}
                                    className="text-rose-500"
                                />
                                Instagram
                                <ArrowUpRight size={13}/>
                            </a>
                        )}
                        {facebook && (
                            <a
                                href={facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    px-4
                                    py-2.5
                                    bg-white
                                    rounded-xl
                                    text-xs
                                    font-semibold
                                    border
                                    border-slate-200/60
                                "
                            >
                                <Facebook
                                    size={15}
                                    className="text-blue-500"
                                />
                                Facebook
                                <ArrowUpRight size={13}/>
                            </a>
                        )}
                    </div>
                </div>
            )}
            {selectedImage && (
                <div
                    className="
                        fixed
                        inset-0
                        z-50
                        flex
                        items-center
                        justify-center
                        p-4
                        bg-black/80
                        backdrop-blur-md
                    "
                    onClick={()=>
                        setSelectedImage(null)
                    }
                >
                    <button
                        className="
                            absolute
                            top-4
                            right-4
                            p-2
                            bg-white/10
                            rounded-full
                            text-white
                        "
                        onClick={()=>
                            setSelectedImage(null)
                        }
                    >
                        <X size={20}/>
                    </button>
                    <img
                        src={selectedImage}
                        alt="Detalle"
                        className="
                            max-w-full
                            max-h-[85vh]
                            object-contain
                            rounded-xl
                        "

                    />
                </div>
            )}
        </div>
    );
}