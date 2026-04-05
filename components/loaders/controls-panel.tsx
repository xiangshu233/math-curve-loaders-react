"use client";

import { useTranslations } from "next-intl";
import type { LoaderConfig, LoaderDefinition } from "@/types/loader";

type ControlsPanelProps = {
  loader: LoaderDefinition;
  config: LoaderConfig;
  onChange: (key: string, value: number) => void;
  onReset: () => void;
};

function formatControlValue(key: string, value: number): string {
  if (key.endsWith("Ms")) {
    return `${(value / 1000).toFixed(1)}s`;
  }
  if (key === "trailSpan" || key === "strokeWidth" || !Number.isInteger(value)) {
    return value.toFixed(2);
  }
  return `${Math.round(value)}`;
}

export function ControlsPanel({ loader, config, onChange, onReset }: ControlsPanelProps) {
  const t = useTranslations("controls");
  const tLabel = useTranslations("controlLabels");

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h3 className="text-xs font-mono tracking-widest uppercase text-gray-400 m-0">
          {t("title")}
        </h3>
        <button
          type="button"
          onClick={onReset}
          className="appearance-none border border-white/10 bg-transparent text-white px-3 py-1.5 font-mono text-xs tracking-widest uppercase cursor-pointer hover:bg-white/5 transition-colors"
        >
          {t("reset")}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {loader.controls.map((control) => {
          const raw = config[control.key];
          const value = typeof raw === "number" ? raw : control.min;
          return (
            <label key={control.key} className="p-3 border border-white/10 bg-[#050505] flex flex-col">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-mono tracking-widest uppercase text-gray-400">
                  {tLabel(control.key, { defaultMessage: control.label })}
                </span>
                <span className="font-mono text-xs text-white">
                  {formatControlValue(control.key, value)}
                </span>
              </div>
              <input
                type="range"
                min={control.min}
                max={control.max}
                step={control.step}
                value={value}
                onChange={(e) => onChange(control.key, parseFloat(e.target.value))}
                className="w-full m-0 accent-[var(--color-accent-custom)] bg-transparent h-1 appearance-none [&::-webkit-slider-runnable-track]:bg-white/10 [&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[var(--color-accent-custom)] [&::-webkit-slider-thumb]:-mt-1"
              />
            </label>
          );
        })}
      </div>
    </div>
  );
}
