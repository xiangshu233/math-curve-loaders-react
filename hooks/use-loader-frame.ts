"use client";

import { useEffect, useRef, useState } from "react";
import type { LoaderConfig, PlotPoint } from "@/types/loader";
import {
  buildPath,
  getDetailScale,
  getParticleState,
  getRotationDeg,
} from "@/utils/curve";

type UseLoaderFrameParams = {
  config: LoaderConfig;
  point: (progress: number, detailScale: number, config: LoaderConfig) => PlotPoint;
};

type Particle = PlotPoint & { radius: number; opacity: number };

type LoaderFrameState = {
  pathData: string;
  particles: Particle[];
  rotationDeg: number;
};

export function useLoaderFrame({ config, point }: UseLoaderFrameParams): LoaderFrameState {
  const [frame, setFrame] = useState<LoaderFrameState>({
    pathData: "",
    particles: [],
    rotationDeg: 0,
  });

  const phaseOffsetRef = useRef(0.37);

  useEffect(() => {
    let raf = 0;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const duration = config.durationMs ?? 4600;
      const progress = (elapsed % duration) / duration;
      const detailScale = getDetailScale(elapsed, config, phaseOffsetRef.current);
      const rotationDeg = getRotationDeg(elapsed, config, phaseOffsetRef.current);
      const pathData = buildPath(config, detailScale, point);
      const count = Math.max(2, Math.round(config.particleCount ?? 64));
      const particles = Array.from({ length: count }, (_, index) =>
        getParticleState(config, index, progress, detailScale, point)
      );

      setFrame({ pathData, particles, rotationDeg });
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [config, point]);

  return frame;
}
