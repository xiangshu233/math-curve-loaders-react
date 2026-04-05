import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/**
 * App Router 不使用 `next.config` 里的 `i18n` 字段——那是
 * [Pages Router 专用](https://nextjs.org/docs/pages/guides/internationalization) 的配置。
 *
 * 与文档里「子路径路由、默认区域设置没有前缀」一致的行为，由 `next-intl` 在
 * `i18n/routing.ts` 里通过 `localePrefix: "as-needed"` 实现。
 *
 * App Router 官方说明：
 * https://nextjs.org/docs/app/building-your-application/routing/internationalization
 */
const nextConfig: NextConfig = {};

export default withNextIntl(nextConfig);
