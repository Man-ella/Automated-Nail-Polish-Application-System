import type {
  BoundaryPoint,
  CycleTimePoint,
  RequirementSpec,
  ThicknessPoint,
} from "@/types";

// Performance series — last 10 trials.
export const boundarySeries: BoundaryPoint[] = [
  { trial: 1, errorMm: 0.92 },
  { trial: 2, errorMm: 0.81 },
  { trial: 3, errorMm: 0.76 },
  { trial: 4, errorMm: 0.69 },
  { trial: 5, errorMm: 1.12 },
  { trial: 6, errorMm: 0.74 },
  { trial: 7, errorMm: 0.55 },
  { trial: 8, errorMm: 0.62 },
  { trial: 9, errorMm: 0.81 },
  { trial: 10, errorMm: 0.62 },
];

export const cycleTimeSeries: CycleTimePoint[] = [
  { trial: 1, seconds: 322 },
  { trial: 2, seconds: 311 },
  { trial: 3, seconds: 295 },
  { trial: 4, seconds: 287 },
  { trial: 5, seconds: 348 },
  { trial: 6, seconds: 295 },
  { trial: 7, seconds: 287 },
  { trial: 8, seconds: 251 },
  { trial: 9, seconds: 304 },
  { trial: 10, seconds: 251 },
];

export const thicknessLayers: ThicknessPoint[] = [
  { layer: 1, thicknessMicrons: 38, targetMicrons: 40 },
  { layer: 2, thicknessMicrons: 41, targetMicrons: 40 },
  { layer: 3, thicknessMicrons: 39, targetMicrons: 40 },
  { layer: 4, thicknessMicrons: 42, targetMicrons: 40 },
];

export const repeatabilitySeries = [
  { trial: 1, boundary: 0.62, thickness: 7.8 },
  { trial: 2, boundary: 0.65, thickness: 8.1 },
  { trial: 3, boundary: 0.61, thickness: 7.6 },
  { trial: 4, boundary: 0.64, thickness: 8.4 },
  { trial: 5, boundary: 0.59, thickness: 7.9 },
  { trial: 6, boundary: 0.63, thickness: 8.0 },
];

// Requirements panel — mirrors the Phase 1C target table from the deck.
export const requirements: RequirementSpec[] = [
  {
    id: "boundary",
    name: "Boundary Accuracy",
    target: "< 1.0 mm",
    rationale: "Prevent overflow onto skin",
    actual: 0.62,
    unit: "mm",
    attainmentPct: 92,
    passing: true,
  },
  {
    id: "latency",
    name: "Control Loop Latency",
    target: "< 100 ms",
    rationale: "Real-time closed-loop requirement",
    actual: 78,
    unit: "ms",
    attainmentPct: 88,
    passing: true,
  },
  {
    id: "repeatability",
    name: "Repeatability",
    target: "≥ 5 identical trials",
    rationale: "Consistent, deterministic output",
    actual: 6,
    unit: "trials",
    attainmentPct: 100,
    passing: true,
  },
  {
    id: "cycle",
    name: "Cycle Time",
    target: "≤ 5 min / hand",
    rationale: "vs. 30–60 min manually",
    actual: 4.18,
    unit: "min",
    attainmentPct: 84,
    passing: true,
  },
  {
    id: "thickness",
    name: "Thickness Consistency",
    target: "± 10% variation",
    rationale: "Uniform multi-layer coating quality",
    actual: 7.8,
    unit: "%",
    attainmentPct: 78,
    passing: true,
  },
  {
    id: "iou",
    name: "Segmentation IoU",
    target: "> 0.90 vs baseline",
    rationale: "Must beat classical CV",
    actual: 0.942,
    unit: "IoU",
    attainmentPct: 94,
    passing: true,
  },
];
