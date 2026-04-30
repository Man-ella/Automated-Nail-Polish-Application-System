// NailBot — domain types shared between the API client and UI.
// Mirrors the supervisory & logging layer described in the design deck:
// session logs, boundary accuracy, thickness metrics, cycle time, repeatability.

export type RobotState =
  | "IDLE"
  | "CALIBRATE"
  | "GENERATE_PATH"
  | "APPLY_LAYER"
  | "EVALUATE_THICKNESS"
  | "DRY"
  | "COMPLETE"
  | "ERROR";

export type SessionOutcome = "success" | "failure" | "partial" | "running";

export type HardwareStatus = "online" | "offline" | "degraded" | "calibrating";

export interface NailProfile {
  id: string;
  label: string;          // e.g. "Index L", "Thumb R"
  shape: "almond" | "square" | "round" | "oval" | "stiletto";
}

export interface OperatorSummary {
  id: string;
  name: string;
  email?: string;
}

export interface TrialMetrics {
  boundaryErrorMm: number;       // target < 1 mm
  thicknessVariationPct: number; // target ± 10%
  cycleTimeSec: number;          // target ≤ 300s / hand
  controlLoopMs: number;         // target < 100 ms
  iou: number;                   // segmentation IoU
}

export interface SessionLogEntry {
  id: string;
  startedAt: string; // ISO
  endedAt: string | null;
  operator: OperatorSummary;
  nailProfile: NailProfile;
  modelVersion: string;
  outcome: SessionOutcome;
  metrics: TrialMetrics;
  notes?: string;
}

export interface RequirementSpec {
  id: string;
  name: string;
  target: string;
  rationale: string;
  actual: number;
  unit: string;
  // Lower-is-better requirements (e.g. boundary error) flip the math; this is
  // the % of the target met where 100% means we hit the spec exactly.
  attainmentPct: number;
  passing: boolean;
}

export interface CycleTimePoint {
  trial: number;
  seconds: number;
}

export interface BoundaryPoint {
  trial: number;
  errorMm: number;
}

export interface ThicknessPoint {
  layer: number;
  thicknessMicrons: number;
  targetMicrons: number;
}

export interface DatasetStats {
  totalSamples: number;
  labeled: number;
  unlabeled: number;
  edgeCases: number;
  pendingReview: number;
}

export interface ModelVersion {
  version: string;
  releasedAt: string;
  iou: number;
  pixelAcc: number;
  status: "deployed" | "candidate" | "deprecated";
  notes?: string;
}

export interface RetrainingReadiness {
  // 0–100; 100 = ready to retrain
  score: number;
  thresholdsMet: {
    label: string;
    met: boolean;
    detail: string;
  }[];
}

export interface HardwareComponent {
  id: string;
  label: string;
  kind: "motor" | "camera" | "end-effector" | "sensor" | "controller";
  status: HardwareStatus;
  lastChecked: string;
  metric?: { label: string; value: string };
}

export interface CalibrationItem {
  id: string;
  label: string;
  status: "ok" | "due" | "overdue";
  lastRun: string;
  nextDue: string;
}

export interface EventLog {
  id: string;
  ts: string;
  level: "info" | "warn" | "error";
  source: string;
  message: string;
}

export interface OverviewSnapshot {
  state: RobotState;
  stateSince: string;
  currentSession: {
    id: string;
    operator: string;
    nail: string;
    progressPct: number;
    layer: number;
    layersTotal: number;
  } | null;
  lastRun: SessionLogEntry | null;
  health: {
    cpuPct: number;
    tempC: number;
    diskPct: number;
    uptimeSec: number;
  };
  cameraOnline: boolean;
  modelVersion: string;
  modelLatencyMs: number;
  safety: {
    estopReady: boolean;
    enclosureClosed: boolean;
    powerNominal: boolean;
  };
}
