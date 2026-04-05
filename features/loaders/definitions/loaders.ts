import { generateStandaloneCode } from "@/features/loaders/definitions/loader-codes";
import type { ControlDefinition, LoaderDefinition } from "@/types/loader";

const CORE_CONTROLS: ControlDefinition[] = [
  { key: "particleCount", label: "Particles", min: 24, max: 140, step: 1 },
  { key: "trailSpan", label: "Trail", min: 0.12, max: 0.68, step: 0.01 },
  { key: "durationMs", label: "Loop", min: 2400, max: 12000, step: 100 },
  { key: "pulseDurationMs", label: "Pulse", min: 1800, max: 10000, step: 100 },
  { key: "rotationDurationMs", label: "Rotate", min: 6000, max: 60000, step: 500 },
  { key: "strokeWidth", label: "Stroke", min: 2.5, max: 7.5, step: 0.1 },
];

const thinkingControls: ControlDefinition[] = [
  ...CORE_CONTROLS,
  { key: "baseRadius", label: "Base radius", min: 4, max: 10, step: 0.1 },
  { key: "detailAmplitude", label: "Detail", min: 1, max: 5, step: 0.1 },
  { key: "petalCount", label: "Petals", min: 3, max: 12, step: 1 },
  { key: "curveScale", label: "Scale", min: 2.5, max: 5.5, step: 0.1 },
];

function buildThinkingLoader(
  slug: string,
  name: string,
  petals: number
): LoaderDefinition {
  return {
    slug,
    name,
    tag: "Custom Rose Trail",
    description: "The base circle is carved by a sevenfold cosine term, so the trail blooms into a rotating seven-petal ring.",
    rotate: true,
    defaults: {
      rotate: true,
      particleCount: 64,
      trailSpan: 0.38,
      durationMs: 4600,
      pulseDurationMs: 4200,
      rotationDurationMs: 28000,
      strokeWidth: 5.5,
      baseRadius: 7,
      detailAmplitude: 3,
      petalCount: petals,
      curveScale: 3.9,
    },
    controls: thinkingControls,
    formula: (config) =>
      `x(t)=50+(${config.baseRadius?.toFixed(1)}cos t-${config.detailAmplitude?.toFixed(1)}s cos ${Math.round(
        config.petalCount ?? petals
      )}t)*${config.curveScale?.toFixed(1)}
y(t)=50+(${config.baseRadius?.toFixed(1)}sin t-${config.detailAmplitude?.toFixed(1)}s sin ${Math.round(
        config.petalCount ?? petals
      )}t)*${config.curveScale?.toFixed(1)}`,
    componentCode: "",
    point: (progress, detailScale, config) => {
      const t = progress * Math.PI * 2;
      const k = Math.round(config.petalCount ?? petals);
      const x =
        (config.baseRadius ?? 7) * Math.cos(t) -
        (config.detailAmplitude ?? 3) * detailScale * Math.cos(k * t);
      const y =
        (config.baseRadius ?? 7) * Math.sin(t) -
        (config.detailAmplitude ?? 3) * detailScale * Math.sin(k * t);
      return {
        x: 50 + x * (config.curveScale ?? 3.9),
        y: 50 + y * (config.curveScale ?? 3.9),
      };
    },
  };
}

const roseControls: ControlDefinition[] = [
  ...CORE_CONTROLS,
  { key: "roseA", label: "Base radius", min: 5, max: 14, step: 0.1 },
  { key: "roseABoost", label: "Detail", min: 0, max: 2, step: 0.05 },
  { key: "roseK", label: "Petals", min: 2, max: 10, step: 1 },
  { key: "roseScale", label: "Scale", min: 2, max: 5, step: 0.05 },
];

function buildRoseLoader(
  slug: string,
  name: string,
  k: number
): LoaderDefinition {
  return {
    slug,
    name,
    tag: `r = a cos(${k}θ)`,
    description: `Rose curve with k=${k}.`,
    rotate: true,
    defaults: {
      rotate: true,
      particleCount: 78,
      trailSpan: 0.32,
      durationMs: 5400,
      pulseDurationMs: 4600,
      rotationDurationMs: 28000,
      strokeWidth: 4.6,
      roseA: 9.2,
      roseABoost: 0.6,
      roseBreathBase: 0.72,
      roseBreathBoost: 0.28,
      roseK: k,
      roseScale: 3.25,
    },
    controls: roseControls,
    formula: (config) =>
      `r(t)=(${config.roseA?.toFixed(1)}+${config.roseABoost?.toFixed(2)}s)cos(${Math.round(
        config.roseK ?? k
      )}t)
x=50+cos(t)r(t)${config.roseScale?.toFixed(2)}
y=50+sin(t)r(t)${config.roseScale?.toFixed(2)}`,
    componentCode: "",
    point: (progress, detailScale, config) => {
      const t = progress * Math.PI * 2;
      const a = (config.roseA ?? 9.2) + detailScale * (config.roseABoost ?? 0.6);
      const nk = Math.round(config.roseK ?? k);
      const r =
        a *
        ((config.roseBreathBase ?? 0.72) +
          detailScale * (config.roseBreathBoost ?? 0.28)) *
        Math.cos(nk * t);
      return {
        x: 50 + Math.cos(t) * r * (config.roseScale ?? 3.25),
        y: 50 + Math.sin(t) * r * (config.roseScale ?? 3.25),
      };
    },
  };
}

  function buildSpiralLoader(
    slug: string,
    name: string,
    R: number
  ): LoaderDefinition {
    return {
      slug,
      name,
      tag: `R = ${R}, r = 1, d = 3`,
      description: `Rolling-circle path settles into ${R} looping petals.`,
      rotate: true,
      defaults: {
        rotate: true,
        particleCount: 80 + R,
        trailSpan: 0.34,
        durationMs: 4600,
        pulseDurationMs: 4200,
        rotationDurationMs: 28000,
        strokeWidth: 4.4,
        spiralR: R,
        spiralr: 1,
        spirald: 3,
        spiralScale: 3.5,
        spiralBreath: 0.45,
      },
      controls: [
        ...CORE_CONTROLS,
        { key: "spiralR", label: "R", min: 2, max: 8, step: 1 },
        { key: "spiralr", label: "r", min: 1, max: 3, step: 0.1 },
        { key: "spirald", label: "d", min: 1, max: 5, step: 0.1 },
        { key: "spiralScale", label: "Scale", min: 1.2, max: 5.5, step: 0.05 },
        { key: "spiralBreath", label: "Pulse", min: 0, max: 1, step: 0.05 },
      ],
      formula: (config) =>
        `u(t)=((R-r)cos t+d cos((R-r)t/r),(R-r)sin t-d sin((R-r)t/r))
m(t)=${config.spiralScale?.toFixed(2)}+${config.spiralBreath?.toFixed(2)}s
(x,y)=50+u(t)m(t)
R=${config.spiralR?.toFixed(1)},r=${config.spiralr?.toFixed(1)},d=${config.spirald?.toFixed(1)}`,
      componentCode: "",
      point: (progress, detailScale, config) => {
        const t = progress * Math.PI * 2;
        const d = (config.spirald ?? 3) + detailScale * 0.25;
        const sr = config.spiralR ?? R;
        const s_r = config.spiralr ?? 1;
        const baseX =
          (sr - s_r) * Math.cos(t) +
          d * Math.cos(((sr - s_r) / s_r) * t);
        const baseY =
          (sr - s_r) * Math.sin(t) -
          d * Math.sin(((sr - s_r) / s_r) * t);
        const scale = (config.spiralScale ?? 3.5) + detailScale * (config.spiralBreath ?? 0.45);
        return {
          x: 50 + baseX * scale,
          y: 50 + baseY * scale,
        };
      },
    };
  }

  export const LOADER_DEFINITIONS: LoaderDefinition[] = [
  {
    ...buildThinkingLoader("original-thinking", "Original Thinking", 7),
    tag: "x = 7cos t − d·cos(7t)",
    description:
      "Two lines: x = 7cos(t) − d·cos(7t), y = 7sin(t) − d·sin(7t) with d on the pulse. Same family as the sliders — tune Petals / Detail instead of duplicating cards.",
  },
  {
    ...buildThinkingLoader("thinking-five", "Thinking Five", 5),
    tag: "k = 5 epicycloid",
    description:
      "Five lobes: smaller k than the default seven, so the inner pattern stays open and rhythmic.",
  },
  {
    ...buildThinkingLoader("thinking-nine", "Thinking Nine", 9),
    tag: "k = 9 epicycloid",
    description:
      "Nine lobes: higher k packs more turns in the ring for a denser, more braided look.",
  },
  {
    slug: "rose-orbit",
    name: "Rose Orbit",
    tag: "r = cos(kθ)",
    description: "Orbit radius is modulated by cos(k·t).",
    rotate: true,
    defaults: {
      rotate: true,
      particleCount: 72,
      trailSpan: 0.42,
      durationMs: 5200,
      pulseDurationMs: 4600,
      rotationDurationMs: 28000,
      strokeWidth: 5.2,
      orbitRadius: 7,
      detailAmplitude: 2.7,
      petalCount: 7,
      curveScale: 3.9,
    },
    controls: [
      ...CORE_CONTROLS,
      { key: "orbitRadius", label: "Base radius", min: 4, max: 10, step: 0.1 },
      { key: "detailAmplitude", label: "Detail", min: 1, max: 5, step: 0.1 },
      { key: "petalCount", label: "Petals", min: 3, max: 12, step: 1 },
      { key: "curveScale", label: "Scale", min: 2.5, max: 5.5, step: 0.1 },
    ],
    formula: (config) =>
      `r=${config.orbitRadius?.toFixed(1)}-${config.detailAmplitude?.toFixed(1)}s cos(${Math.round(config.petalCount ?? 7)}t)
x=50+cos(t)r${config.curveScale?.toFixed(1)}
y=50+sin(t)r${config.curveScale?.toFixed(1)}`,
    componentCode: "",
    point: (progress, detailScale, config) => {
      const t = progress * Math.PI * 2;
      const k = Math.round(config.petalCount ?? 7);
      const r =
        (config.orbitRadius ?? 7) -
        (config.detailAmplitude ?? 2.7) * detailScale * Math.cos(k * t);
      return {
        x: 50 + Math.cos(t) * r * (config.curveScale ?? 3.9),
        y: 50 + Math.sin(t) * r * (config.curveScale ?? 3.9),
      };
    },
  },
  {
    ...buildRoseLoader("rose-curve", "Rose Curve", 5),
    description: "Using r = a cos(5t) creates five evenly spaced lobes, and the breathing multiplier gently swells each petal in and out.",
  },
  {
    ...buildRoseLoader("rose-two", "Rose Two", 2),
    description: "With k = 2, the cosine radius forms broad opposing petals, and the breathing factor makes the center pulse like the original.",
  },
  {
    ...buildRoseLoader("rose-three", "Rose Three", 3),
    description: "With k = 3, the curve resolves into three rotating petals, and the inner breathing keeps the motion from feeling mathematically rigid.",
  },
  {
    ...buildRoseLoader("rose-four", "Rose Four", 4),
    description: "With k = 4, the petals settle into a balanced cross-like rose, and the breathing core adds the same soft pulse as the original loader.",
  },
  {
    slug: "lissajous-drift",
    name: "Lissajous Drift",
    tag: "x = sin(at), y = sin(bt)",
    description: "Crossing sinusoidal frequencies.",
    rotate: false,
    defaults: {
      rotate: false,
      particleCount: 68,
      trailSpan: 0.34,
      durationMs: 6000,
      pulseDurationMs: 5400,
      rotationDurationMs: 36000,
      strokeWidth: 4.7,
      lissajousAmp: 32,
      lissajousAmpBoost: 6,
      lissajousAX: 3,
      lissajousBY: 4,
      lissajousPhase: 1.57,
      lissajousYScale: 0.92,
    },
    controls: [
      ...CORE_CONTROLS,
      { key: "lissajousAmp", label: "Base radius", min: 8, max: 36, step: 0.5 },
      { key: "lissajousAmpBoost", label: "Detail", min: 0, max: 12, step: 0.1 },
      { key: "lissajousAX", label: "Petals", min: 1, max: 8, step: 1 },
      { key: "lissajousYScale", label: "Scale", min: 0.4, max: 1.4, step: 0.01 },
    ],
    formula: (config) =>
      `A=${config.lissajousAmp?.toFixed(1)}+${config.lissajousAmpBoost?.toFixed(1)}s
x=50+sin(${Math.round(config.lissajousAX ?? 3)}t+${config.lissajousPhase?.toFixed(2)})A
y=50+sin(${Math.round(config.lissajousBY ?? 4)}t)${config.lissajousYScale?.toFixed(2)}A`,
    componentCode: "",
    point: (progress, detailScale, config) => {
      const t = progress * Math.PI * 2;
      const amp = (config.lissajousAmp ?? 32) + detailScale * (config.lissajousAmpBoost ?? 6);
      return {
        x: 50 + Math.sin(Math.round(config.lissajousAX ?? 3) * t + (config.lissajousPhase ?? 1.57)) * amp,
        y: 50 + Math.sin(Math.round(config.lissajousBY ?? 4) * t) * amp * (config.lissajousYScale ?? 0.92),
      };
    },
  },
  {
    slug: "lemniscate-bloom",
    name: "Lemniscate Bloom",
    tag: "Bernoulli Lemniscate",
    description: "Breathing infinity curve.",
    rotate: false,
    defaults: {
      rotate: false,
      particleCount: 70,
      trailSpan: 0.4,
      durationMs: 5600,
      pulseDurationMs: 5000,
      rotationDurationMs: 34000,
      strokeWidth: 4.8,
      lemniscateA: 32,
      lemniscateBoost: 7,
    },
    controls: [
      ...CORE_CONTROLS,
      { key: "lemniscateA", label: "Base radius", min: 8, max: 30, step: 0.5 },
      { key: "lemniscateBoost", label: "Detail", min: 0, max: 12, step: 0.1 },
    ],
    formula: (config) =>
      `a=${config.lemniscateA?.toFixed(1)}+${config.lemniscateBoost?.toFixed(1)}s
x=50+a cos(t)/(1+sin²(t))
y=50+a sin(t)cos(t)/(1+sin²(t))`,
    componentCode: "",
    point: (progress, detailScale, config) => {
      const t = progress * Math.PI * 2;
      const a = (config.lemniscateA ?? 32) + detailScale * (config.lemniscateBoost ?? 7);
      const denom = 1 + Math.sin(t) ** 2;
      return {
        x: 50 + (a * Math.cos(t)) / denom,
        y: 50 + (a * Math.sin(t) * Math.cos(t)) / denom,
      };
    },
  },
  {
    slug: "hypotrochoid-loop",
    name: "Hypotrochoid Loop",
    tag: "Inner Spirograph",
    description: "Nested loops from rolling-circle terms.",
    rotate: false,
    defaults: {
      rotate: false,
      particleCount: 82,
      trailSpan: 0.46,
      durationMs: 7600,
      pulseDurationMs: 6200,
      rotationDurationMs: 42000,
      strokeWidth: 4.6,
      spiroR: 8.2,
      spiror: 2.7,
      spirorBoost: 0.45,
      spirod: 4.8,
      spirodBoost: 1.2,
      spiroScale: 3.05,
    },
    controls: [
      ...CORE_CONTROLS,
      { key: "spiroR", label: "Base radius", min: 4, max: 12, step: 0.1 },
      { key: "spirod", label: "Detail", min: 1, max: 8, step: 0.1 },
      { key: "spiror", label: "Petals", min: 1, max: 5, step: 0.1 },
      { key: "spiroScale", label: "Scale", min: 1.5, max: 4.5, step: 0.05 },
    ],
    formula: (config) =>
      `x=50+((R-r)cos t+d cos((R-r)t/r))*${config.spiroScale?.toFixed(2)}
y=50+((R-r)sin t-d sin((R-r)t/r))*${config.spiroScale?.toFixed(2)}
R=${config.spiroR?.toFixed(1)},r=${config.spiror?.toFixed(1)},d=${config.spirod?.toFixed(1)}`,
    componentCode: "",
    point: (progress, detailScale, config) => {
      const t = progress * Math.PI * 2;
      const r = (config.spiror ?? 2.7) + detailScale * (config.spirorBoost ?? 0.45);
      const d = (config.spirod ?? 4.8) + detailScale * (config.spirodBoost ?? 1.2);
      const x =
        ((config.spiroR ?? 8.2) - r) * Math.cos(t) +
        d * Math.cos((((config.spiroR ?? 8.2) - r) / r) * t);
      const y =
        ((config.spiroR ?? 8.2) - r) * Math.sin(t) -
        d * Math.sin((((config.spiroR ?? 8.2) - r) / r) * t);
      return {
        x: 50 + x * (config.spiroScale ?? 3.05),
        y: 50 + y * (config.spiroScale ?? 3.05),
      };
    },
  },
  {
    ...buildSpiralLoader("three-petal-spiral", "Three-Petal Spiral", 3),
    description: "This rolling-circle setup resolves into three large looping petals, all breathing together like a compact spiral flower.",
  },
  {
    ...buildSpiralLoader("four-petal-spiral", "Four-Petal Spiral", 4),
    description: "With R = 4, the rolling-circle path settles into four looping petals, rotating and breathing as one ring.",
  },
  {
    ...buildSpiralLoader("five-petal-spiral", "Five-Petal Spiral", 5),
    description: "With R = 5, the loop count increases to five petals, giving the spiral flower a denser and more ornate rhythm.",
  },
  {
    ...buildSpiralLoader("six-petal-spiral", "Six-Petal Spiral", 6),
    description: "The rolling-circle path splits into six petals, and the whole ring breathes in one unified pulse like the original loader.",
  },
  {
    slug: "butterfly-phase",
    name: "Butterfly Phase",
    tag: "Butterfly Curve",
    description: "Exponential and high-frequency cosine terms stretch the wings unevenly.",
    rotate: false,
    defaults: {
      rotate: false,
      particleCount: 88,
      trailSpan: 0.32,
      durationMs: 9000,
      pulseDurationMs: 7000,
      rotationDurationMs: 50000,
      strokeWidth: 4.4,
      butterflyTurns: 12,
      butterflyScale: 6.6,
      butterflyPulse: 0.45,
      butterflyCosWeight: 2,
      butterflyPower: 5,
    },
    controls: [
      ...CORE_CONTROLS,
      { key: "butterflyTurns", label: "Turns", min: 6, max: 18, step: 0.5 },
      { key: "butterflyScale", label: "Scale", min: 2.5, max: 7, step: 0.05 },
      { key: "butterflyPulse", label: "Pulse", min: 0, max: 1.2, step: 0.01 },
      { key: "butterflyCosWeight", label: "Cos weight", min: 0.5, max: 4, step: 0.05 },
      { key: "butterflyPower", label: "Power", min: 2, max: 8, step: 1 },
    ],
    formula: (config) =>
      `u=${config.butterflyTurns?.toFixed(1)}t
B(u)=e^{cos u}-${config.butterflyCosWeight?.toFixed(2)}cos 4u-sin^${Math.round(config.butterflyPower ?? 5)}(u/12)
x=50+sin u B(u)(${config.butterflyScale?.toFixed(2)}+${config.butterflyPulse?.toFixed(2)}s)
y=50+cos u B(u)(${config.butterflyScale?.toFixed(2)}+${config.butterflyPulse?.toFixed(2)}s)`,
    componentCode: "",
    point: (progress, detailScale, config) => {
      const t = progress * Math.PI * (config.butterflyTurns ?? 12);
      const s =
        Math.exp(Math.cos(t)) -
        (config.butterflyCosWeight ?? 2) * Math.cos(4 * t) -
        Math.pow(Math.sin(t / 12), Math.round(config.butterflyPower ?? 5));
      const scale = (config.butterflyScale ?? 6.6) + detailScale * (config.butterflyPulse ?? 0.45);
      return {
        x: 50 + Math.sin(t) * s * scale,
        y: 50 + Math.cos(t) * s * scale,
      };
    },
  },
  {
    slug: "cardioid-glow",
    name: "Cardioid Glow",
    tag: "Cardioid",
    description: "Soft pulsing heart wave.",
    rotate: false,
    defaults: {
      rotate: false,
      particleCount: 72,
      trailSpan: 0.36,
      durationMs: 6200,
      pulseDurationMs: 5200,
      rotationDurationMs: 36000,
      strokeWidth: 4.9,
      cardioidA: 8.4,
      cardioidPulse: 0.8,
      cardioidScale: 3.15,
    },
    controls: [
      ...CORE_CONTROLS,
      { key: "cardioidA", label: "Base radius", min: 4, max: 14, step: 0.1 },
      { key: "cardioidPulse", label: "Pulse", min: 0, max: 2, step: 0.05 },
      { key: "cardioidScale", label: "Scale", min: 1, max: 5.5, step: 0.05 },
    ],
    formula: (config) =>
      `a=${config.cardioidA?.toFixed(1)}+${config.cardioidPulse?.toFixed(2)}s
r(t)=a(1-cos t)
x=50+cos t r(t)${config.cardioidScale?.toFixed(2)}
y=50+sin t r(t)${config.cardioidScale?.toFixed(2)}`,
    componentCode: "",
    point: (progress, detailScale, config) => {
      const t = progress * Math.PI * 2;
      const a = (config.cardioidA ?? 8.4) + detailScale * (config.cardioidPulse ?? 0.8);
      const r = a * (1 - Math.cos(t));
      return {
        x: 50 + (Math.cos(t) * r + a * 0.875) * (config.cardioidScale ?? 3.15),
        y: 50 + Math.sin(t) * r * (config.cardioidScale ?? 3.15),
      };
    },
  },
  {
    slug: "cardioid-heart",
    name: "Cardioid Heart",
    tag: "r = a(1 + cosθ)",
    description: "Upright heart from cardioid.",
    rotate: false,
    defaults: {
      rotate: false,
      particleCount: 74,
      trailSpan: 0.36,
      durationMs: 6200,
      pulseDurationMs: 5200,
      rotationDurationMs: 36000,
      strokeWidth: 4.9,
      cardioidA: 8.8,
      cardioidPulse: 0.8,
      cardioidScale: 3.15,
    },
    controls: [
      ...CORE_CONTROLS,
      { key: "cardioidA", label: "Base radius", min: 4, max: 14, step: 0.1 },
      { key: "cardioidPulse", label: "Pulse", min: 0, max: 2, step: 0.05 },
      { key: "cardioidScale", label: "Scale", min: 1, max: 5.5, step: 0.05 },
    ],
    formula: (config) =>
      `a=${config.cardioidA?.toFixed(1)}+${config.cardioidPulse?.toFixed(2)}s
r(t)=a(1+cos t)
x'=-sin t r(t)
y'=-cos t r(t), m=${config.cardioidScale?.toFixed(2)}`,
    componentCode: "",
    point: (progress, detailScale, config) => {
      const t = progress * Math.PI * 2;
      const a = (config.cardioidA ?? 8.8) + detailScale * (config.cardioidPulse ?? 0.8);
      const r = a * (1 + Math.cos(t));
      const baseX = Math.cos(t) * r;
      const baseY = Math.sin(t) * r;
      return {
        x: 50 - baseY * (config.cardioidScale ?? 3.15),
        y: 50 - (baseX - a * 0.875) * (config.cardioidScale ?? 3.15),
      };
    },
  },
  {
    slug: "heart-wave",
    name: "Heart Wave",
    tag: "f(x) Heart Wave",
    description: "x^(2/3) envelope with sin(bπx) interior ripples.",
    rotate: false,
    defaults: {
      rotate: false,
      particleCount: 104,
      trailSpan: 0.18,
      durationMs: 8400,
      pulseDurationMs: 5600,
      rotationDurationMs: 22000,
      strokeWidth: 3.9,
      heartWaveB: 6.4,
      heartWaveRoot: 3.3,
      heartWaveAmp: 0.9,
      heartWaveScaleX: 22,
      heartWaveScaleY: 22,
    },
    controls: [
      ...CORE_CONTROLS,
      { key: "heartWaveB", label: "b", min: 2, max: 12, step: 0.1 },
      { key: "heartWaveRoot", label: "Root span", min: 2.2, max: 4.2, step: 0.05 },
      { key: "heartWaveAmp", label: "Wave amp", min: 0.3, max: 1.6, step: 0.05 },
      { key: "heartWaveScaleX", label: "X scale", min: 14, max: 30, step: 0.1 },
      { key: "heartWaveScaleY", label: "Y scale", min: 14, max: 34, step: 0.1 },
    ],
    formula: (config) =>
      `f(x)=|x|^(2/3)+${config.heartWaveAmp?.toFixed(2)}√(${config.heartWaveRoot?.toFixed(2)}-x²)sin(${config.heartWaveB?.toFixed(1)}πx)
screenX=50+x·${config.heartWaveScaleX?.toFixed(1)}
screenY=18+(1.75-f(x))(${config.heartWaveScaleY?.toFixed(1)}+1.5s)`,
    componentCode: "",
    point: (progress, detailScale, config) => {
      const xLimit = Math.sqrt(config.heartWaveRoot ?? 3.3);
      const x = -xLimit + progress * xLimit * 2;
      const safeRoot = Math.max(0, (config.heartWaveRoot ?? 3.3) - x * x);
      const b = config.heartWaveB ?? 6.4;
      const wave = (config.heartWaveAmp ?? 0.9) * Math.sqrt(safeRoot) * Math.sin(b * Math.PI * x);
      const curve = Math.pow(Math.abs(x), 2 / 3);
      const y = curve + wave;
      const scaleX = config.heartWaveScaleX ?? 22;
      const scaleY = (config.heartWaveScaleY ?? 22) + detailScale * 1.5;
      return {
        x: 50 + x * scaleX,
        y: 50 - (y - 0.75) * scaleY,
      };
    },
  },
  {
    slug: "spiral-search",
    name: "Spiral Search",
    tag: "Archimedean Spiral",
    description: "Fast-growing angle combined with a cosine-modulated radius.",
    rotate: false,
    defaults: {
      rotate: false,
      particleCount: 86,
      trailSpan: 0.28,
      durationMs: 7800,
      pulseDurationMs: 6800,
      rotationDurationMs: 44000,
      strokeWidth: 4.3,
      searchTurns: 4,
      searchBaseRadius: 8,
      searchRadiusAmp: 8.5,
      searchPulse: 2.4,
      searchScale: 1.5,
    },
    controls: [
      ...CORE_CONTROLS,
      { key: "searchTurns", label: "Turns", min: 2, max: 8, step: 0.1 },
      { key: "searchBaseRadius", label: "Base radius", min: 2, max: 16, step: 0.1 },
      { key: "searchRadiusAmp", label: "Radius amp", min: 2, max: 16, step: 0.1 },
      { key: "searchPulse", label: "Pulse", min: 0, max: 6, step: 0.1 },
      { key: "searchScale", label: "Scale", min: 0.5, max: 1.8, step: 0.05 },
    ],
    formula: (config) =>
      `θ(t)=${config.searchTurns?.toFixed(1)}t
r(t)=${config.searchBaseRadius?.toFixed(1)}+(1-cos t)(${config.searchRadiusAmp?.toFixed(1)}+${config.searchPulse?.toFixed(1)}s)
x=50+cos θ r(t)${config.searchScale?.toFixed(2)}
y=50+sin θ r(t)${config.searchScale?.toFixed(2)}`,
    componentCode: "",
    point: (progress, detailScale, config) => {
      const t = progress * Math.PI * 2;
      const angle = t * (config.searchTurns ?? 4);
      const radius =
        (config.searchBaseRadius ?? 8) +
        (1 - Math.cos(t)) * ((config.searchRadiusAmp ?? 8.5) + detailScale * (config.searchPulse ?? 2.4));
      return {
        x: 50 + Math.cos(angle) * radius * (config.searchScale ?? 1.5),
        y: 50 + Math.sin(angle) * radius * (config.searchScale ?? 1.5),
      };
    },
  },
  {
    slug: "fourier-flow",
    name: "Fourier Flow",
    tag: "Fourier Curve",
    description: "Sine and cosine components interfere with one another.",
    rotate: false,
    defaults: {
      rotate: false,
      particleCount: 92,
      trailSpan: 0.31,
      durationMs: 8400,
      pulseDurationMs: 6800,
      rotationDurationMs: 44000,
      strokeWidth: 4.2,
      fourierX1: 17,
      fourierX3: 7.5,
      fourierX5: 3.2,
      fourierY1: 15,
      fourierY2: 8.2,
      fourierY4: 4.2,
      fourierMixBase: 1,
      fourierMixPulse: 0.16,
    },
    controls: [
      ...CORE_CONTROLS,
      { key: "fourierX1", label: "x cos1", min: 4, max: 24, step: 0.1 },
      { key: "fourierX3", label: "x cos3", min: 0, max: 14, step: 0.1 },
      { key: "fourierX5", label: "x sin5", min: 0, max: 10, step: 0.1 },
      { key: "fourierY1", label: "y sin1", min: 4, max: 24, step: 0.1 },
      { key: "fourierY2", label: "y sin2", min: 0, max: 14, step: 0.1 },
      { key: "fourierY4", label: "y cos4", min: 0, max: 10, step: 0.1 },
      { key: "fourierMixPulse", label: "Mix pulse", min: 0, max: 0.8, step: 0.01 },
    ],
    formula: (config) =>
      `x=50+${config.fourierX1?.toFixed(1)}cos t+${config.fourierX3?.toFixed(1)}cos(3t+0.6m)+${config.fourierX5?.toFixed(1)}sin(5t-0.4)
y=50+${config.fourierY1?.toFixed(1)}sin t+${config.fourierY2?.toFixed(1)}sin(2t+0.25)-${config.fourierY4?.toFixed(1)}cos(4t-0.5m)
m=${config.fourierMixBase?.toFixed(2)}+${config.fourierMixPulse?.toFixed(2)}s`,
    componentCode: "",
    point: (progress, detailScale, config) => {
      const t = progress * Math.PI * 2;
      const mix = (config.fourierMixBase ?? 1) + detailScale * (config.fourierMixPulse ?? 0.16);
      const x =
        (config.fourierX1 ?? 17) * Math.cos(t) +
        (config.fourierX3 ?? 7.5) * Math.cos(3 * t + 0.6 * mix) +
        (config.fourierX5 ?? 3.2) * Math.sin(5 * t - 0.4);
      const y =
        (config.fourierY1 ?? 15) * Math.sin(t) +
        (config.fourierY2 ?? 8.2) * Math.sin(2 * t + 0.25) -
        (config.fourierY4 ?? 4.2) * Math.cos(4 * t - 0.5 * mix);
      return {
        x: 50 + x,
        y: 50 + y,
      };
    },
  },
];

export const LOADER_MAP = Object.fromEntries(
  LOADER_DEFINITIONS.map((loader) => {
    loader.componentCode = generateStandaloneCode(loader);
    return [loader.slug, loader];
  })
);
