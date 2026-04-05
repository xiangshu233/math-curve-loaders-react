"use client";

import { motion } from "motion/react";
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
      layoutId={`card-${slug}`}
      style={{ borderRadius: 0 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative group flex h-full min-h-0 w-full flex-1 cursor-pointer flex-col items-stretch border border-white/10 bg-[#0a0a0a] p-5 transition-colors hover:z-10 hover:border-white/30"
    >
      <Crosshair className="-top-1.5 -left-1.5 opacity-50 group-hover:opacity-100 transition-opacity" />
      <Crosshair className="-top-1.5 -right-1.5 opacity-50 group-hover:opacity-100 transition-opacity" />
      <Crosshair className="-bottom-1.5 -left-1.5 opacity-50 group-hover:opacity-100 transition-opacity" />
      <Crosshair className="-bottom-1.5 -right-1.5 opacity-50 group-hover:opacity-100 transition-opacity" />

      {/* Fixed-height stage so every card’s SVG area aligns */}
      <div className="flex h-[148px] w-full shrink-0 items-center justify-center">
        <motion.div
          layoutId={`icon-${slug}`}
          className="flex size-[128px] items-center justify-center"
        >
          <LoaderSvg
            config={loader.defaults}
            point={loader.point}
            className="h-full w-full text-white/80 group-hover:text-white transition-colors"
          />
        </motion.div>
      </div>

      {/* Title + tag only — description lives in the detail modal */}
      <div className="relative z-10 mt-4 flex w-full flex-col items-center gap-2 text-center">
        <motion.div
          layoutId={`title-${slug}`}
          className="w-full text-[15px] font-bold leading-snug text-white group-hover:text-[var(--color-accent-custom)] transition-colors"
        >
          {copy.name}
        </motion.div>
        <div className="line-clamp-2 w-full text-[9px] font-mono uppercase leading-snug tracking-widest text-gray-500">
          {copy.tag}
        </div>
      </div>
    </motion.div>
  );
}
