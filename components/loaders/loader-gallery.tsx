"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { LOADER_DEFINITIONS } from "@/features/loaders/definitions/loaders";
import { LoaderCard } from "@/components/loaders/loader-card";
import { LoaderDetailShell } from "@/components/loaders/loader-detail-shell";
import { Crosshair } from "@/components/ui/crosshair";
import { LanguageSwitcher } from "@/components/language-switcher";

const GITHUB_REPO_URL =
  "https://github.com/xiangshu233/math-curve-loaders-react";

export function LoaderGallery() {
  const t = useTranslations("gallery");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const selectedLoader = selectedSlug ? LOADER_DEFINITIONS.find(l => l.slug === selectedSlug) : null;

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedSlug) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedSlug]);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[var(--color-accent-custom)]/30 flex flex-col w-full">
      {/* Header */}
      <header className="border-b border-white/10 relative z-30 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 h-24 flex flex-col justify-center border-x border-white/10 relative pr-36 sm:pr-40">
          <Crosshair className="-bottom-1.5 -left-1.5" />
          <Crosshair className="-bottom-1.5 -right-1.5" />
          <div className="absolute right-6 top-1/2 z-10 flex -translate-y-1/2 items-center gap-2">
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex border border-white/15 bg-[#0a0a0a] p-1.5 text-gray-300 transition-colors hover:border-white/30 hover:text-white"
              aria-label={t("githubAria")}
            >
              <svg
                viewBox="0 0 24 24"
                className="size-3.5"
                fill="currentColor"
                aria-hidden
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <LanguageSwitcher />
          </div>

          <p className="text-[10px] tracking-[0.24em] text-gray-500 uppercase mb-2">
            {t("eyebrow")}
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {t("title")}
          </h1>
        </div>
      </header>

      {/* Hatched Divider */}
      <div className="max-w-7xl mx-auto w-full border-x border-b border-white/10 h-12 bg-hatch relative">
        <Crosshair className="-bottom-1.5 -left-1.5" />
        <Crosshair className="-bottom-1.5 -right-1.5" />
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto border-x border-white/10 relative flex flex-col">
        {/* Grid Section */}
        <div className="p-6 flex-1 bg-[#050505]">
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0 border-t border-l border-white/10"
          >
            <AnimatePresence mode="popLayout">
              {LOADER_DEFINITIONS.map((loader) => (
                <div
                  key={loader.slug}
                  className="flex h-full min-h-0 flex-col"
                >
                  <LoaderCard
                    slug={loader.slug}
                    onClick={() => setSelectedSlug(loader.slug)}
                  />
                </div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      {/* Bottom Hatched Divider */}
      <div className="max-w-7xl mx-auto w-full border-x border-t border-white/10 h-12 bg-hatch relative mt-auto">
        <Crosshair className="-top-1.5 -left-1.5" />
        <Crosshair className="-top-1.5 -right-1.5" />
      </div>

      <AnimatePresence>
        {selectedLoader && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSlug(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div
              layoutId={`card-${selectedLoader.slug}`}
              initial={{ scale: 0.9, opacity: 0, filter: 'blur(10px)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              exit={{ scale: 0.9, opacity: 0, filter: 'blur(10px)' }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative z-10 flex w-full max-w-7xl flex-col overflow-hidden border border-white/10 bg-[#050505] shadow-2xl md:max-h-[90vh]"
            >
              <Crosshair className="-top-1.5 -left-1.5" />
              <Crosshair className="-top-1.5 -right-1.5" />
              <Crosshair className="-bottom-1.5 -left-1.5" />
              <Crosshair className="-bottom-1.5 -right-1.5" />

              <LoaderDetailShell slug={selectedLoader.slug} onClose={() => setSelectedSlug(null)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
