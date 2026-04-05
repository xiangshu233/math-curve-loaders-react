export type CoreControlKey =
  | "particleCount"
  | "trailSpan"
  | "durationMs"
  | "pulseDurationMs"
  | "rotationDurationMs"
  | "strokeWidth";

export type CurveControlKey =
  | "baseRadius"
  | "detailAmplitude"
  | "petalCount"
  | "curveScale"
  | "orbitRadius"
  | "roseA"
  | "roseABoost"
  | "roseBreathBase"
  | "roseBreathBoost"
  | "roseK"
  | "roseScale"
  | "lissajousAmp"
  | "lissajousAmpBoost"
  | "lissajousAX"
  | "lissajousBY"
  | "lissajousPhase"
  | "lissajousYScale"
  | "lemniscateA"
  | "lemniscateBoost"
  | "spiroR"
  | "spiror"
  | "spirorBoost"
  | "spirod"
  | "spirodBoost"
  | "spiroScale"
  | "spiralR"
  | "spiralr"
  | "spirald"
  | "spiralScale"
  | "spiralBreath"
  | "butterflyTurns"
  | "butterflyScale"
  | "butterflyPulse"
  | "butterflyCosWeight"
  | "butterflyPower"
  | "cardioidA"
  | "cardioidPulse"
  | "cardioidScale"
  | "heartWaveB"
  | "heartWaveRoot"
  | "heartWaveAmp"
  | "heartWaveScaleX"
  | "heartWaveScaleY"
  | "searchTurns"
  | "searchBaseRadius"
  | "searchRadiusAmp"
  | "searchPulse"
  | "searchScale"
  | "fourierX1"
  | "fourierX3"
  | "fourierX5"
  | "fourierY1"
  | "fourierY2"
  | "fourierY4"
  | "fourierMixBase"
  | "fourierMixPulse";

export type ControlKey = CoreControlKey | CurveControlKey;

export type LoaderConfig = Partial<Record<ControlKey, number>> & {
  rotate: boolean;
};

export type ControlDefinition = {
  key: ControlKey;
  label: string;
  min: number;
  max: number;
  step: number;
};

export type PlotPoint = {
  x: number;
  y: number;
};

export type LoaderDefinition = {
  slug: string;
  name: string;
  tag: string;
  description: string;
  rotate: boolean;
  defaults: LoaderConfig;
  controls: ControlDefinition[];
  formula: (config: LoaderConfig) => string;
  componentCode: string;
  point: (progress: number, detailScale: number, config: LoaderConfig) => PlotPoint;
};
