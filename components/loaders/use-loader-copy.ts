"use client";

import { useTranslations } from "next-intl";
import type { LoaderDefinition } from "@/types/loader";

/** Resolves loader title / tag / description with zh.json overrides and English fallbacks. */
export function useLoaderCopy(loader: LoaderDefinition) {
  const t = useTranslations("loaders");
  const slug = loader.slug;
  const key = (field: "name" | "description" | "tag") =>
    `${slug}.${field}` as const;
  return {
    name: t(key("name"), { defaultMessage: loader.name }),
    description: t(key("description"), { defaultMessage: loader.description }),
    tag: t(key("tag"), { defaultMessage: loader.tag }),
  };
}
