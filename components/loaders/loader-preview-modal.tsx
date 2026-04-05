"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import type { LoaderDefinition } from "@/types/loader";
import { LoaderDetailShell } from "@/components/loaders/loader-detail-shell";
import { Crosshair } from "@/components/ui/crosshair";

type LoaderPreviewModalProps = {
  loader: LoaderDefinition;
  onClose: () => void;
};

/** Shell matches Pixet `PreviewModal.tsx` (custom div + motion, not Dialog). */
export function LoaderPreviewModal({ loader, onClose }: LoaderPreviewModalProps) {
  const t = useTranslations("detail");

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        <motion.div
          layoutId={`card-${loader.slug}`}
          style={{ borderRadius: 0 }}
          initial={{ scale: 0.9, opacity: 0, filter: "blur(10px)" }}
          animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
          exit={{ scale: 0.9, opacity: 0, filter: "blur(10px)" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative z-10 flex min-h-0 w-full max-w-7xl max-h-[min(92vh,860px)] flex-col overflow-visible rounded-none border border-white/10 bg-[#050505] shadow-2xl"
        >
          <Crosshair className="-top-1.5 -left-1.5" />
          <Crosshair className="-top-1.5 -right-1.5" />
          <Crosshair className="-bottom-1.5 -left-1.5" />
          <Crosshair className="-bottom-1.5 -right-1.5" />

          <div className="absolute right-4 top-4 z-30">
            <button
              type="button"
              onClick={onClose}
              className="border border-white/10 bg-transparent p-2 text-gray-400 transition-colors hover:border-white/30 hover:text-white"
              aria-label={t("close")}
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-none">
            <LoaderDetailShell slug={loader.slug} />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
