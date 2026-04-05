"use client";

import { useEffect, useRef } from "react";
import type { LoaderConfig } from "@/types/loader";
import { buildPath, getDetailScale, getParticleState, getRotationDeg } from "@/utils/curve";

import { cn } from "@/lib/utils";

type LoaderSvgProps = {
  config: LoaderConfig;
  point: (progress: number, detailScale: number, config: LoaderConfig) => {
    x: number;
    y: number;
  };
  className?: string;
};

export function LoaderSvg({ config, point, className }: LoaderSvgProps) {
  const groupRef = useRef<SVGGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const particlesRef = useRef<(SVGCircleElement | null)[]>([]);
  
  // Use refs to keep animation state stable across config changes
  const startTimeRef = useRef<number | null>(null);
  const phaseOffsetRef = useRef<number>(Math.random());

  const particleCount = Math.max(2, Math.round(config.particleCount ?? 64));

  useEffect(() => {
    let raf = 0;
    
    if (startTimeRef.current === null) {
      startTimeRef.current = performance.now();
    }

    const tick = (now: number) => {
      const elapsed = now - (startTimeRef.current ?? now);
      const duration = config.durationMs ?? 4600;
      const progress = (elapsed % duration) / duration;
      const detailScale = getDetailScale(elapsed, config, phaseOffsetRef.current);
      const rotationDeg = getRotationDeg(elapsed, config, phaseOffsetRef.current);

      if (groupRef.current) {
        groupRef.current.setAttribute("transform", `rotate(${rotationDeg} 50 50)`);
      }

      if (pathRef.current) {
        pathRef.current.setAttribute("d", buildPath(config, detailScale, point));
      }

      for (let i = 0; i < particleCount; i++) {
        const circle = particlesRef.current[i];
        if (circle) {
          const state = getParticleState(config, i, progress, detailScale, point);
          circle.setAttribute("cx", state.x.toFixed(2));
          circle.setAttribute("cy", state.y.toFixed(2));
          circle.setAttribute("r", state.radius.toFixed(2));
          circle.setAttribute("opacity", state.opacity.toFixed(3));
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [config, point, particleCount]);

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className={cn("overflow-visible", className)}
      aria-hidden="true"
    >
      <g ref={groupRef}>
        <path
          ref={pathRef}
          stroke="currentColor"
          strokeWidth={config.strokeWidth ?? 5.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.1}
        />
        {Array.from({ length: particleCount }).map((_, index) => (
          <circle
            key={`p-${index}`}
            ref={(el) => {
              particlesRef.current[index] = el;
            }}
            fill="currentColor"
          />
        ))}
      </g>
    </svg>
  );
}
