import type { OverviewSnapshot } from "@/types";
import { mockSessions } from "./mock-sessions";

export const overviewSnapshot: OverviewSnapshot = {
  state: "APPLY_LAYER",
  stateSince: "2026-04-29T15:42:18Z",
  currentSession: {
    id: "S-2026-0429-015",
    operator: "Diane Insua",
    nail: "Index R · almond",
    progressPct: 64,
    layer: 2,
    layersTotal: 3,
  },
  lastRun: mockSessions[0],
  health: {
    cpuPct: 41,
    tempC: 52.4,
    diskPct: 38,
    uptimeSec: 4 * 3600 + 27 * 60,
  },
  cameraOnline: true,
  modelVersion: "v1.4.2",
  modelLatencyMs: 78,
  safety: {
    estopReady: true,
    enclosureClosed: true,
    powerNominal: true,
  },
};
