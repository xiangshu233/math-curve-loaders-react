import type { LoaderConfig, PlotPoint } from "@/types/loader";

export function normalizeProgress(progress: number): number {
  return ((progress % 1) + 1) % 1;
}

export function getDetailScale(
  time: number,
  config: LoaderConfig,
  phaseOffset: number
): number {
  const pulseDurationMs = config.pulseDurationMs ?? 4200;
  const pulseProgress = ((time + phaseOffset * pulseDurationMs) % pulseDurationMs) / pulseDurationMs;
  const pulseAngle = pulseProgress * Math.PI * 2;
  return 0.52 + ((Math.sin(pulseAngle + 0.55) + 1) / 2) * 0.48;
}

export function getRotationDeg(
  time: number,
  config: LoaderConfig,
  phaseOffset: number
): number {
  if (!config.rotate) {
    return 0;
  }
  const duration = config.rotationDurationMs ?? 28000;
  return -(((time + phaseOffset * duration) % duration) / duration) * 360;
}

export function buildPath(
  config: LoaderConfig,
  detailScale: number,
  pointFn: (progress: number, detailScale: number, config: LoaderConfig) => PlotPoint,
  steps = 480
): string {
  return Array.from({ length: steps + 1 }, (_, index) => {
    const point = pointFn(index / steps, detailScale, config);
    return `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
  }).join(" ");
}

export function getParticleState(
  config: LoaderConfig,
  index: number,
  progress: number,
  detailScale: number,
  pointFn: (progress: number, detailScale: number, config: LoaderConfig) => PlotPoint
): PlotPoint & { radius: number; opacity: number } {
  const count = Math.max(2, Math.round(config.particleCount ?? 64));
  const tailOffset = index / (count - 1);
  const point = pointFn(
    normalizeProgress(progress - tailOffset * (config.trailSpan ?? 0.38)),
    detailScale,
    config
  );
  const fade = Math.pow(1 - tailOffset, 0.56);
  return {
    x: point.x,
    y: point.y,
    radius: 0.9 + fade * 2.7,
    opacity: 0.04 + fade * 0.96,
  };
}
