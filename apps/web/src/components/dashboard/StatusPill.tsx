import { cn } from "@/lib/utils";
import type { HardwareStatus, RobotState, SessionOutcome } from "@/types";

const ROBOT_STATE_STYLES: Record<RobotState, string> = {
  IDLE:               "bg-slate-100 text-slate-700",
  CALIBRATE:          "bg-sky-100 text-sky-800",
  GENERATE_PATH:      "bg-nailbot-pink/40 text-nailbot-burgundy",
  APPLY_LAYER:        "bg-nailbot-burgundy text-white",
  EVALUATE_THICKNESS: "bg-violet-100 text-violet-800",
  DRY:                "bg-amber-100 text-amber-800",
  COMPLETE:           "bg-emerald-100 text-emerald-800",
  ERROR:              "bg-rose-100 text-rose-700",
};

const HW_STATUS_STYLES: Record<HardwareStatus, string> = {
  online:      "bg-emerald-100 text-emerald-700",
  offline:     "bg-rose-100 text-rose-700",
  degraded:    "bg-amber-100 text-amber-800",
  calibrating: "bg-sky-100 text-sky-700",
};

const OUTCOME_STYLES: Record<SessionOutcome, string> = {
  success: "bg-emerald-100 text-emerald-700",
  failure: "bg-rose-100 text-rose-700",
  partial: "bg-amber-100 text-amber-800",
  running: "bg-nailbot-pink/40 text-nailbot-burgundy",
};

export function StatePill({ state }: { state: RobotState }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] tracking-tight",
        ROBOT_STATE_STYLES[state],
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {state.replace(/_/g, " ")}
    </span>
  );
}

export function HardwarePill({ status }: { status: HardwareStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize",
        HW_STATUS_STYLES[status],
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}

export function OutcomePill({ outcome }: { outcome: SessionOutcome }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize",
        OUTCOME_STYLES[outcome],
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {outcome}
    </span>
  );
}
