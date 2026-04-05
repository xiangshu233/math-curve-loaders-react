"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "motion/react";
import type { LoaderConfig } from "@/types/loader";
import { LoaderSvg } from "@/components/loaders/loader-svg";
import { ControlsPanel } from "@/components/loaders/controls-panel";
import { LOADER_MAP } from "@/features/loaders/definitions/loaders";
import { generateStandaloneCode } from "@/features/loaders/definitions/loader-codes";
import { StandaloneReactCodeBlock } from "@/components/loaders/standalone-react-code-block";
import { useLoaderCopy } from "@/components/loaders/use-loader-copy";
import { useTranslations } from "next-intl";
import { Copy, Check } from "lucide-react";

type LoaderDetailShellProps = {
  slug: string;
};

export function LoaderDetailShell({ slug }: LoaderDetailShellProps) {
  const loader = LOADER_MAP[slug] ?? LOADER_MAP["original-thinking"];
  const [config, setConfig] = useState<LoaderConfig>(loader.defaults);
  const [copiedReact, setCopiedReact] = useState(false);
  const [copiedFormula, setCopiedFormula] = useState(false);
  const t = useTranslations("detail");
  const copy = useLoaderCopy(loader);

  useEffect(() => {
    const next = LOADER_MAP[slug] ?? LOADER_MAP["original-thinking"];
    setConfig(next.defaults);
  }, [slug]);

  const formulaText = useMemo(() => loader.formula(config), [loader, config]);

  const liveComponentCode = useMemo(
    () => generateStandaloneCode(loader, config),
    [loader, config]
  );

  useEffect(() => {
    if (!copiedReact) return;
    const timer = window.setTimeout(() => setCopiedReact(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copiedReact]);

  useEffect(() => {
    if (!copiedFormula) return;
    const timer = window.setTimeout(() => setCopiedFormula(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copiedFormula]);

  const handleCopyFormula = async () => {
    await navigator.clipboard.writeText(formulaText);
    setCopiedFormula(true);
  };

  const handleCopyReactComponent = async () => {
    await navigator.clipboard.writeText(liveComponentCode);
    setCopiedReact(true);
  };

  const metaSecond = `${Math.round(config.particleCount ?? 64)} pts`;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row md:min-h-[min(85vh,760px)] md:max-h-[88vh]">
      {/* Left: preview + meta + controls + formula */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col border-b border-white/10 md:w-1/2 md:border-b-0 md:border-r md:border-white/10">
        <div className="relative shrink-0 border-b border-white/10 bg-[#050505] p-6 md:p-8">
          <div className="mx-auto flex max-w-md flex-col items-center text-center">
            <motion.div
              layoutId={`icon-${slug}`}
              className="relative z-10 mb-6 flex aspect-square w-full max-w-[220px] items-center justify-center"
            >
              <LoaderSvg
                config={config}
                point={loader.point}
                className="h-full w-full text-[#f5f5f5]"
              />
            </motion.div>

            <motion.div
              layoutId={`title-${slug}`}
              className="mb-2 text-xl font-bold tracking-tight text-white md:text-2xl"
            >
              {copy.name}
            </motion.div>

            <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
              <span className="max-w-[min(100%,14rem)] truncate border border-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-gray-400 md:text-xs">
                {copy.tag}
              </span>
              <span className="border border-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-gray-400 md:text-xs">
                {metaSecond}
              </span>
            </div>

            <div className="w-full max-w-[42ch] border-t border-white/10 pt-5 text-left">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-gray-500">
                {t("intro")}
              </p>
              <p className="text-[12px] leading-relaxed text-white/60 md:text-[13px]">
                {copy.description}
              </p>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto bg-[#050505] p-6 md:p-8">
          <div className="flex flex-col gap-8">
            <ControlsPanel
              loader={loader}
              config={config}
              onReset={() => setConfig(loader.defaults)}
              onChange={(key, value) =>
                setConfig((prev) => ({
                  ...prev,
                  [key]: value,
                }))
              }
            />

            <div>
              <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="m-0 font-mono text-xs uppercase tracking-widest text-gray-400">
                  {t("formula")}
                </h3>
                <button
                  type="button"
                  onClick={handleCopyFormula}
                  className="flex w-full shrink-0 items-center justify-center gap-2 border border-white/10 bg-transparent px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-white transition-colors hover:bg-white/5 sm:w-auto"
                >
                  {copiedFormula ? (
                    <Check size={14} className="text-green-400" />
                  ) : (
                    <Copy size={14} />
                  )}
                  {copiedFormula ? t("copied") : t("copyFormula")}
                </button>
              </div>
              <pre className="m-0 whitespace-pre-wrap border border-white/10 bg-[#0a0a0a] p-4 font-mono text-[11px] leading-[1.6] text-[#f2f2f2]">
                {formulaText}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Right: React code */}
      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col bg-[#0a0a0a] md:w-1/2">
        <div className="flex min-h-0 flex-1 flex-col p-6 pt-14 md:p-8 md:pt-16">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="m-0 font-mono text-xs uppercase tracking-widest text-gray-400">
              {t("reactTitle")}
            </h3>
            <button
              type="button"
              onClick={handleCopyReactComponent}
              className="flex w-full shrink-0 items-center justify-center gap-2 bg-[var(--color-accent-custom)] px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-black transition-colors hover:bg-[#d47a53] sm:w-auto"
            >
              {copiedReact ? <Check size={14} /> : <Copy size={14} />}
              {copiedReact ? t("copied") : t("copyFullFile")}
            </button>
          </div>

          <p className="mb-4 text-[10px] leading-relaxed text-gray-500">
            {t("reactHint", { react: "react", tsx: ".tsx" })}{" "}
            <span className="text-gray-400">{t("reactHintTail")}</span>
          </p>

          <div className="min-h-0 flex-1 overflow-auto border border-white/10">
            <StandaloneReactCodeBlock code={liveComponentCode} />
          </div>
        </div>
      </div>
    </div>
  );
}
