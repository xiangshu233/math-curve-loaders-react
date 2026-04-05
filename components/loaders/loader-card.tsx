"use client";

import { motion } from "framer-motion";
import { LoaderSvg } from "@/components/loaders/loader-svg";
import { LOADER_MAP } from "@/features/loaders/definitions/loaders";
import { useLoaderCopy } from "@/components/loaders/use-loader-copy";
import { Crosshair } from "@/components/ui/crosshair";

type LoaderCardProps = {
  slug: string;
  onClick: () => void;
};

export function LoaderCard({ slug, onClick }: LoaderCardProps) {
  const loader = LOADER_MAP[slug];
  const copy = useLoaderCopy(loader ?? LOADER_MAP["original-thinking"]);
  if (!loader) {
    return null;
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, filter: 'blur(4px)' }}
      transition={{ duration: 0.25, type: 'spring', bounce: 0.2 }}
      layoutId={`card-${slug}`}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-[#0a0a0a] p-6 flex h-full min-h-[400px] w-full flex-1 flex-col items-stretch cursor-pointer border border-white/10 hover:border-white/30 transition-colors group relative -mt-[1px] -ml-[1px] hover:z-10"
    >
      <Crosshair className="-top-1.5 -left-1.5 opacity-50 group-hover:opacity-100 transition-opacity" />
      <Crosshair className="-top-1.5 -right-1.5 opacity-50 group-hover:opacity-100 transition-opacity" />
      <Crosshair className="-bottom-1.5 -left-1.5 opacity-50 group-hover:opacity-100 transition-opacity" />
      <Crosshair className="-bottom-1.5 -right-1.5 opacity-50 group-hover:opacity-100 transition-opacity" />

      {/* Fixed-height stage so every card’s SVG area aligns */}
      <div className="h-[176px] shrink-0 flex items-center justify-center w-full">
        <motion.div layoutId={`icon-${slug}`} className="size-[140px] flex items-center justify-center">
          <LoaderSvg
            config={loader.defaults}
            point={loader.point}
            className="h-full w-full text-white/80 group-hover:text-white transition-colors"
          />
        </motion.div>
      </div>

      {/* Text block: title / formula / description each full width; min-heights keep rows aligned */}
      <div className="mt-4 flex w-full flex-1 flex-col gap-2 text-left relative z-10">
        <motion.div
          layoutId={`title-${slug}`}
          className="min-h-[1.35em] text-[15px] font-bold leading-snug text-white group-hover:text-[var(--color-accent-custom)] transition-colors"
        >
          {copy.name}
        </motion.div>
        <div className="min-h-[2.75em] text-[9px] font-mono uppercase tracking-widest leading-snug text-gray-500">
          {copy.tag}
        </div>
        <div className="min-h-[5.5rem] flex-1 text-[11px] leading-[1.6] text-gray-500">
          {copy.description}
        </div>
      </div>
    </motion.div>
  );
}
