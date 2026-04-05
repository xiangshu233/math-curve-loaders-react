import { defineRouting } from "next-intl/routing";

/**
 * 对齐 Next 文档中的「子路径路由」：默认区域设置**没有** URL 前缀
 *（与 [Pages i18n 指南](https://nextjs.org/docs/pages/guides/internationalization#sub-path-routing) 描述一致；
 * 本站为 App Router，故用 next-intl，而非 `next.config` 的 `i18n`）。
 *
 * - 英文（默认）：`/`，地址栏不出现 `/en`
 * - 中文：`/zh`
 */
export const routing = defineRouting({
  locales: ["en", "zh"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});
