import type { LoaderConfig, LoaderDefinition } from "@/types/loader";

/** PascalCase from slug: original-thinking → OriginalThinking */
function componentNameFromSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join("");
}

/**
 * Single-file React component: only `react` required. No Tailwind / Framer / this repo.
 * Uses the same math as LoaderSvg + utils/curve.ts.
 *
 * @param config — When set (e.g. current UI sliders), embedded `DEFAULT_CONFIG` matches the live preview.
 */
export function generateStandaloneCode(
  loader: LoaderDefinition,
  config?: LoaderConfig
): string {
  const name = componentNameFromSlug(loader.slug);
  const componentName = `${name}Loader`;
  const effective: LoaderConfig = config
    ? { ...loader.defaults, ...config }
    : loader.defaults;
  const defaults = JSON.stringify(effective, null, 2);
  const pointSrc = loader.point.toString();

  const lines: string[] = [];

  lines.push("/**");
  lines.push(` * ${loader.name} — animated SVG curve loader`);
  lines.push(" * Dependencies: react only. Save as .tsx with JSX runtime enabled.");
  lines.push(" */");
  lines.push("");
  lines.push('import { useEffect, useRef } from "react";');
  lines.push('import type { CSSProperties } from "react";');
  lines.push("");
  lines.push("type PlotPoint = { x: number; y: number };");
  lines.push("");
  lines.push(
    "type LoaderConfig = { rotate: boolean; [key: string]: number | boolean | undefined };"
  );
  lines.push("");
  lines.push(`const DEFAULT_CONFIG: LoaderConfig = ${defaults};`);
  lines.push("");
  lines.push("const normalizeProgress = (p: number) => ((p % 1) + 1) % 1;");
  lines.push("");
  lines.push(
    "function getDetailScale(time: number, config: LoaderConfig, phaseOffset: number): number {"
  );
  lines.push("  const pulseDurationMs = config.pulseDurationMs ?? 4200;");
  lines.push(
    "  const pulseProgress = ((time + phaseOffset * pulseDurationMs) % pulseDurationMs) / pulseDurationMs;"
  );
  lines.push("  const pulseAngle = pulseProgress * Math.PI * 2;");
  lines.push("  return 0.52 + ((Math.sin(pulseAngle + 0.55) + 1) / 2) * 0.48;");
  lines.push("}");
  lines.push("");
  lines.push(
    "function getRotationDeg(time: number, config: LoaderConfig, phaseOffset: number): number {"
  );
  lines.push("  if (!config.rotate) return 0;");
  lines.push("  const duration = config.rotationDurationMs ?? 28000;");
  lines.push("  return -(((time + phaseOffset * duration) % duration) / duration) * 360;");
  lines.push("}");
  lines.push("");
  lines.push(`const point: (progress: number, detailScale: number, config: LoaderConfig) => PlotPoint = ${pointSrc};`);
  lines.push("");
  lines.push("function buildPath(");
  lines.push("  config: LoaderConfig,");
  lines.push("  detailScale: number,");
  lines.push("  steps = 480");
  lines.push("): string {");
  lines.push("  return Array.from({ length: steps + 1 }, (_, index) => {");
  lines.push("    const pt = point(index / steps, detailScale, config);");
  lines.push(
    '    return `${index === 0 ? "M" : "L"} ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`;',
  );
  lines.push("  }).join(\" \");");
  lines.push("}");
  lines.push("");
  lines.push("function getParticleState(");
  lines.push("  config: LoaderConfig,");
  lines.push("  index: number,");
  lines.push("  progress: number,");
  lines.push("  detailScale: number,");
  lines.push("  count: number");
  lines.push(") {");
  lines.push("  const tailOffset = index / (count - 1);");
  lines.push("  const pt = point(");
  lines.push(
    "    normalizeProgress(progress - tailOffset * (config.trailSpan ?? 0.38)),",
  );
  lines.push("    detailScale,");
  lines.push("    config");
  lines.push("  );");
  lines.push("  const fade = Math.pow(1 - tailOffset, 0.56);");
  lines.push("  return {");
  lines.push("    x: pt.x,");
  lines.push("    y: pt.y,");
  lines.push("    radius: 0.9 + fade * 2.7,");
  lines.push("    opacity: 0.04 + fade * 0.96,");
  lines.push("  };");
  lines.push("}");
  lines.push("");
  lines.push(`export type ${componentName}Props = {`);
  lines.push("  className?: string;");
  lines.push("  style?: CSSProperties;");
  lines.push("  /** Pixel size (width & height) */");
  lines.push("  size?: number;");
  lines.push("  /** CSS color for stroke & dots (e.g. #e5e5e5 or currentColor) */");
  lines.push("  color?: string;");
  lines.push("};");
  lines.push("");
  lines.push(`export function ${componentName}({`);
  lines.push("  className,");
  lines.push("  style,");
  lines.push("  size = 200,");
  lines.push('  color = "#e5e5e5",');
  lines.push(`}: ${componentName}Props) {`);
  lines.push("  const groupRef = useRef<SVGGElement>(null);");
  lines.push("  const pathRef = useRef<SVGPathElement>(null);");
  lines.push("  const particlesRef = useRef<(SVGCircleElement | null)[]>([]);");
  lines.push("  const startTimeRef = useRef<number | null>(null);");
  lines.push("  const phaseOffsetRef = useRef(Math.random());");
  lines.push("");
  lines.push("  useEffect(() => {");
  lines.push("    const cfg = DEFAULT_CONFIG;");
  lines.push("    const particleCount = Math.max(2, Math.round(cfg.particleCount ?? 64));");
  lines.push("    let raf = 0;");
  lines.push("    if (startTimeRef.current === null) startTimeRef.current = performance.now();");
  lines.push("");
  lines.push("    const tick = (now: number) => {");
  lines.push("      const elapsed = now - (startTimeRef.current ?? now);");
  lines.push("      const duration = cfg.durationMs ?? 4600;");
  lines.push("      const progress = (elapsed % duration) / duration;");
  lines.push(
    "      const detailScale = getDetailScale(elapsed, cfg, phaseOffsetRef.current);",
  );
  lines.push(
    "      const rotationDeg = getRotationDeg(elapsed, cfg, phaseOffsetRef.current);",
  );
  lines.push("");
  lines.push("      if (groupRef.current) {");
  lines.push(
    '        groupRef.current.setAttribute("transform", `rotate(${rotationDeg} 50 50)`);',
  );
  lines.push("      }");
  lines.push("      if (pathRef.current) {");
  lines.push('        pathRef.current.setAttribute("d", buildPath(cfg, detailScale));');
  lines.push("      }");
  lines.push("      for (let i = 0; i < particleCount; i++) {");
  lines.push("        const circle = particlesRef.current[i];");
  lines.push("        if (circle) {");
  lines.push(
    "          const state = getParticleState(cfg, i, progress, detailScale, particleCount);",
  );
  lines.push('          circle.setAttribute("cx", state.x.toFixed(2));');
  lines.push('          circle.setAttribute("cy", state.y.toFixed(2));');
  lines.push('          circle.setAttribute("r", state.radius.toFixed(2));');
  lines.push('          circle.setAttribute("opacity", state.opacity.toFixed(3));');
  lines.push("        }");
  lines.push("      }");
  lines.push("      raf = requestAnimationFrame(tick);");
  lines.push("    };");
  lines.push("");
  lines.push("    raf = requestAnimationFrame(tick);");
  lines.push("    return () => cancelAnimationFrame(raf);");
  lines.push("  }, []);");
  lines.push("");
  lines.push("  return (");
  lines.push('    <svg');
  lines.push('      viewBox="0 0 100 100"');
  lines.push('      fill="none"');
  lines.push("      className={className}");
  lines.push("      style={{ width: size, height: size, color, ...style }}");
  lines.push('      aria-hidden');
  lines.push("    >");
  lines.push("      <g ref={groupRef}>");
  lines.push("        <path");
  lines.push("          ref={pathRef}");
  lines.push('          stroke="currentColor"');
  lines.push(`          strokeWidth={DEFAULT_CONFIG.strokeWidth ?? 5.5}`);
  lines.push('          strokeLinecap="round"');
  lines.push('          strokeLinejoin="round"');
  lines.push("          opacity={0.1}");
  lines.push("        />");
  lines.push(
    "        {Array.from({ length: Math.max(2, Math.round(DEFAULT_CONFIG.particleCount ?? 64)) }).map(",
  );
  lines.push("          (_, index) => (");
  lines.push("            <circle");
  lines.push("              key={index}");
  lines.push("              ref={(el) => {");
  lines.push("                particlesRef.current[index] = el;");
  lines.push("              }}");
  lines.push('              fill="currentColor"');
  lines.push("            />");
  lines.push("          )");
  lines.push("        )}");
  lines.push("      </g>");
  lines.push("    </svg>");
  lines.push("  );");
  lines.push("}");
  lines.push("");

  return lines.join("\n");
}
