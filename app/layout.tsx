import type { ReactNode } from "react";

/**
 * Root passthrough — `<html>` / `<body>` live in `app/[locale]/layout.tsx` for per-locale `lang`.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
