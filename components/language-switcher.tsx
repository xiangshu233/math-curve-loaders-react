"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("gallery");
  const router = useRouter();
  const pathname = usePathname();

  const other =
    locale === routing.defaultLocale
      ? (routing.locales.find((l) => l !== locale) ?? "zh")
      : routing.defaultLocale;

  const label = locale === "zh" ? t("langEn") : t("langZh");

  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, { locale: other })}
      className="border border-white/15 bg-[#0a0a0a] px-3 py-1.5 font-mono text-[10px] tracking-widest text-gray-300 transition-colors hover:border-white/30 hover:text-white"
    >
      {label}
    </button>
  );
}
