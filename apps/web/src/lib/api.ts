/**
 * Thin API client for the NailBot supervisory layer.
 *
 * Today, every method resolves to local mock data so the UI is fully
 * functional in isolation. When the FastAPI backend ships, flip
 * `USE_MOCKS` to `false` (or remove the branch) and the same surface
 * area will hit the real endpoints. Routes are namespaced under `/api`
 * to match the proxy stub in `vite.config.ts`.
 */

import type {
  CalibrationItem,
  EventLog,
  HardwareComponent,
  ModelVersion,
  OverviewSnapshot,
  RequirementSpec,
  RetrainingReadiness,
  SessionLogEntry,
  DatasetStats,
} from "@/types";

import { mockSessions } from "@/data/mock-sessions";
import {
  boundarySeries,
  cycleTimeSeries,
  repeatabilitySeries,
  requirements as mockRequirements,
  thicknessLayers,
} from "@/data/mock-metrics";
import {
  datasetStats as mockDatasetStats,
  failedSamples,
  modelVersions,
  retrainingReadiness,
} from "@/data/mock-pipeline";
import {
  calibrationItems,
  eventLog,
  hardwareComponents,
} from "@/data/mock-hardware";
import { overviewSnapshot } from "@/data/mock-overview";

const USE_MOCKS = true;

async function get<T>(path: string, fallback: T): Promise<T> {
  if (USE_MOCKS) {
    // Simulate network latency to make loading states feel real-ish.
    await new Promise((r) => setTimeout(r, 80));
    return fallback;
  }
  const res = await fetch(`/api${path}`);
  if (!res.ok) {
    throw new Error(`GET /api${path} failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

export const api = {
  // GET /api/overview
  getOverview: () => get<OverviewSnapshot>("/overview", overviewSnapshot),

  // GET /api/sessions
  listSessions: () => get<SessionLogEntry[]>("/sessions", mockSessions),

  // GET /api/metrics/{*}
  getBoundarySeries: () =>
    get<typeof boundarySeries>("/metrics/boundary", boundarySeries),
  getCycleTimeSeries: () =>
    get<typeof cycleTimeSeries>("/metrics/cycle-time", cycleTimeSeries),
  getThicknessLayers: () =>
    get<typeof thicknessLayers>("/metrics/thickness", thicknessLayers),
  getRepeatabilitySeries: () =>
    get<typeof repeatabilitySeries>("/metrics/repeatability", repeatabilitySeries),

  // GET /api/requirements
  getRequirements: () => get<RequirementSpec[]>("/requirements", mockRequirements),

  // GET /api/pipeline/{*}
  getDatasetStats: () =>
    get<DatasetStats>("/pipeline/dataset", mockDatasetStats),
  getModelVersions: () =>
    get<ModelVersion[]>("/pipeline/models", modelVersions),
  getRetrainingReadiness: () =>
    get<RetrainingReadiness>("/pipeline/readiness", retrainingReadiness),
  getFailedSamples: () =>
    get<typeof failedSamples>("/pipeline/failed-samples", failedSamples),

  // GET /api/hardware/{*}
  getHardware: () =>
    get<HardwareComponent[]>("/hardware", hardwareComponents),
  getCalibration: () =>
    get<CalibrationItem[]>("/hardware/calibration", calibrationItems),
  getEventLog: () => get<EventLog[]>("/hardware/events", eventLog),
};
