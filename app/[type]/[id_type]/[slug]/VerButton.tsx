"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import LoadingButton from "../../../components/LoadingButton";

export default function VerButton({ href, label }: { href: string; label: string; }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <button
      onClick={() => {
        setLoading(true);

        setTimeout(() => {
          router.push(href);
        }, 100);
      }}
      disabled={loading}
      className="
        relative flex items-center justify-between
        p-5 bg-[#002B5B] text-white rounded-2xl
        font-bold overflow-hidden
        transition-all duration-300
        h-[64px]
      "
    >
      <span className={`transition ${loading ? "opacity-0" : "opacity-100"}`}>
        Ver {label}
      </span>

      <ArrowRight className={`transition ${loading ? "opacity-0" : "opacity-100"}`} />
      {loading && <LoadingButton message="Abriendo..." />}
    </button>
  );
}