import type {
  DatasetStats,
  ModelVersion,
  RetrainingReadiness,
} from "@/types";

export const datasetStats: DatasetStats = {
  totalSamples: 4_812,
  labeled: 4_417,
  unlabeled: 395,
  edgeCases: 142,
  pendingReview: 28,
};

export const modelVersions: ModelVersion[] = [
  {
    version: "v1.4.2",
    releasedAt: "2026-04-26T18:12:00Z",
    iou: 0.942,
    pixelAcc: 0.987,
    status: "deployed",
    notes: "Cuticle regression fix. Augmentation coverage on stiletto profile.",
  },
  {
    version: "v1.4.1",
    releasedAt: "2026-04-19T14:01:00Z",
    iou: 0.928,
    pixelAcc: 0.982,
    status: "candidate",
    notes: "Trained with rotation + brightness augmentation.",
  },
  {
    version: "v1.3.7",
    releasedAt: "2026-03-30T09:45:00Z",
    iou: 0.913,
    pixelAcc: 0.974,
    status: "deprecated",
  },
  {
    version: "v1.3.0",
    releasedAt: "2026-03-04T22:18:00Z",
    iou: 0.882,
    pixelAcc: 0.961,
    status: "deprecated",
  },
];

export const retrainingReadiness: RetrainingReadiness = {
  score: 72,
  thresholdsMet: [
    { label: "≥ 100 new edge-case samples", met: true,  detail: "142 collected" },
    { label: "Failure-rate trend > 5%",     met: true,  detail: "8.7% over last 50 trials" },
    { label: "Drift score > 0.15",           met: false, detail: "Currently 0.11" },
    { label: "Labeled coverage ≥ 95%",       met: false, detail: "91.8% labeled" },
  ],
};

export const failedSamples = [
  { id: "img-2026-04-29-0014", reason: "Cuticle boundary loss", trial: "S-2026-0429-005" },
  { id: "img-2026-04-29-0011", reason: "Specular reflection on tip", trial: "S-2026-0429-006" },
  { id: "img-2026-04-29-0008", reason: "Skin-tone underexposure", trial: "S-2026-0429-010" },
  { id: "img-2026-04-29-0007", reason: "Stiletto profile mis-segmentation", trial: "S-2026-0429-006" },
  { id: "img-2026-04-29-0004", reason: "Motion blur during capture", trial: "S-2026-0429-012" },
];
