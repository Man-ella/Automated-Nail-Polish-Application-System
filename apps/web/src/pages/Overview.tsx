import {
  Activity,
  Camera,
  Cpu,
  Gauge,
  Lock,
  Power,
  Sparkles,
  ThermometerSun,
  Timer,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeading } from "@/components/dashboard/PageHeading";
import { MetricCard } from "@/components/dashboard/MetricCard";
import {
  HardwarePill,
  OutcomePill,
  StatePill,
} from "@/components/dashboard/StatusPill";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/useApi";
import { api } from "@/lib/api";
import { formatDateTime, formatDuration } from "@/lib/utils";
import { chartColors, tooltipStyle } from "@/components/charts/chartTheme";
import type { HardwareStatus } from "@/types";

const STATE_FLOW = [
  "IDLE",
  "CALIBRATE",
  "GENERATE_PATH",
  "APPLY_LAYER",
  "EVALUATE_THICKNESS",
  "DRY",
  "COMPLETE",
] as const;

export function OverviewPage() {
  const { data: snapshot } = useApi(api.getOverview, []);
  const { data: cycleSeries } = useApi(api.getCycleTimeSeries, []);

  if (!snapshot) {
    return (
      <DashboardLayout title="Overview" subtitle="Loading robot snapshot…">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-xl bg-white/60"
            />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  const cameraStatus: HardwareStatus = snapshot.cameraOnline
    ? "online"
    : "offline";

  return (
    <DashboardLayout
      title="Overview"
      subtitle="Live system snapshot — updated every second"
      state={snapshot.state}
    >
      <PageHeading
        title="Robot Snapshot"
        description="Headline status across the sense → decide → act loop, with current session progress, last run quality, and safety interlocks."
        actions={
          <>
            <Button variant="outline" size="sm">
              Pause
            </Button>
            <Button size="sm">
              <Power className="size-3.5" />
              Run cycle
            </Button>
          </>
        }
      />

      {/* Top metric strip */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Robot State"
          value={snapshot.state.replace(/_/g, " ")}
          hint={`Since ${formatDateTime(snapshot.stateSince)}`}
          icon={<Activity className="size-4" />}
        />
        <MetricCard
          label="Model Latency"
          value={String(snapshot.modelLatencyMs)}
          unit="ms"
          intent={snapshot.modelLatencyMs < 100 ? "good" : "warn"}
          trend="down"
          trendLabel={`Target < 100 ms`}
          icon={<Timer className="size-4" />}
        />
        <MetricCard
          label="Edge CPU"
          value={String(snapshot.health.cpuPct)}
          unit="%"
          hint={`${snapshot.health.tempC.toFixed(1)} °C`}
          intent={snapshot.health.cpuPct < 80 ? "good" : "warn"}
          icon={<Cpu className="size-4" />}
        />
        <MetricCard
          label="Uptime"
          value={formatDuration(snapshot.health.uptimeSec * 1000)}
          hint={`Disk ${snapshot.health.diskPct}%`}
          icon={<ThermometerSun className="size-4" />}
        />
      </div>

      {/* Main grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Current session */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>Current Session</CardTitle>
                <CardDescription>
                  Sense → Decide → Act loop running on edge controller
                </CardDescription>
              </div>
              <StatePill state={snapshot.state} />
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {snapshot.currentSession ? (
              <>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs tracking-tight text-muted-foreground">
                      {snapshot.currentSession.id}
                    </p>
                    <p className="mt-1 text-base font-medium">
                      {snapshot.currentSession.nail}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Operator · {snapshot.currentSession.operator}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    Layer {snapshot.currentSession.layer} of{" "}
                    {snapshot.currentSession.layersTotal}
                  </Badge>
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Toolpath progress
                    </span>
                    <span className="font-medium">
                      {snapshot.currentSession.progressPct}%
                    </span>
                  </div>
                  <Progress value={snapshot.currentSession.progressPct} />
                </div>

                {/* SFC timeline */}
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    SFC State Flow
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {STATE_FLOW.map((s, i) => {
                      const activeIdx = (STATE_FLOW as readonly string[]).indexOf(
                        snapshot.state,
                      );
                      const isPast = i < activeIdx;
                      const isActive = i === activeIdx;
                      return (
                        <div key={s} className="flex items-center gap-1.5">
                          <span
                            className={
                              isActive
                                ? "rounded-md bg-nailbot-burgundy px-2 py-1 font-mono text-[10px] tracking-tight text-white"
                                : isPast
                                ? "rounded-md bg-nailbot-pink/50 px-2 py-1 font-mono text-[10px] tracking-tight text-nailbot-burgundy"
                                : "rounded-md bg-muted px-2 py-1 font-mono text-[10px] tracking-tight text-muted-foreground"
                            }
                          >
                            {s.replace(/_/g, " ")}
                          </span>
                          {i < STATE_FLOW.length - 1 ? (
                            <span className="text-muted-foreground">→</span>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-lg border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
                Robot is idle — no session in progress.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Safety + Camera/Model */}
        <Card>
          <CardHeader>
            <CardTitle>Safety &amp; Perception</CardTitle>
            <CardDescription>Interlocks and vision stack</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <SafetyRow
              icon={<Power className="size-4" />}
              label="E-Stop"
              ok={snapshot.safety.estopReady}
              detail={snapshot.safety.estopReady ? "Armed" : "Tripped"}
            />
            <SafetyRow
              icon={<Lock className="size-4" />}
              label="Enclosure"
              ok={snapshot.safety.enclosureClosed}
              detail={
                snapshot.safety.enclosureClosed ? "Closed" : "Open — paused"
              }
            />
            <SafetyRow
              icon={<Gauge className="size-4" />}
              label="Power Rail"
              ok={snapshot.safety.powerNominal}
              detail={snapshot.safety.powerNominal ? "Nominal" : "Brownout"}
            />
            <Separator className="my-2" />
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2">
                <Camera className="size-4 text-muted-foreground" />
                <span>Workspace Camera</span>
              </span>
              <HardwarePill status={cameraStatus} />
            </div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2">
                <Sparkles className="size-4 text-muted-foreground" />
                <span>Segmentation Model</span>
              </span>
              <Badge variant="outline">{snapshot.modelVersion}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Last run summary */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>Last Run</CardTitle>
                <CardDescription>
                  Most recent completed session
                </CardDescription>
              </div>
              {snapshot.lastRun ? (
                <OutcomePill outcome={snapshot.lastRun.outcome} />
              ) : null}
            </div>
          </CardHeader>
          <CardContent>
            {snapshot.lastRun ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Stat
                  label="Boundary"
                  value={snapshot.lastRun.metrics.boundaryErrorMm.toFixed(2)}
                  unit="mm"
                />
                <Stat
                  label="Thickness"
                  value={snapshot.lastRun.metrics.thicknessVariationPct.toFixed(
                    1,
                  )}
                  unit="%"
                />
                <Stat
                  label="Cycle"
                  value={(snapshot.lastRun.metrics.cycleTimeSec / 60).toFixed(
                    2,
                  )}
                  unit="min"
                />
                <Stat
                  label="IoU"
                  value={snapshot.lastRun.metrics.iou.toFixed(3)}
                  unit=""
                />
                <div className="col-span-2 sm:col-span-4 mt-1 flex items-center justify-between rounded-lg border border-border/60 bg-secondary/40 px-3 py-2 text-xs">
                  <span className="font-mono text-muted-foreground">
                    {snapshot.lastRun.id}
                  </span>
                  <span className="text-muted-foreground">
                    {snapshot.lastRun.operator.name} · {snapshot.lastRun.modelVersion}
                  </span>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Cycle-time sparkline */}
        <Card>
          <CardHeader>
            <CardTitle>Cycle Time</CardTitle>
            <CardDescription>Last 10 trials · target ≤ 300s</CardDescription>
          </CardHeader>
          <CardContent className="h-44 pt-0">
            {cycleSeries ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={cycleSeries}
                  margin={{ left: 0, right: 0, top: 8, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="cycleFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={chartColors.rose}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="100%"
                        stopColor={chartColors.rose}
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    stroke={chartColors.grid}
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="trial"
                    fontSize={11}
                    stroke={chartColors.axis}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    fontSize={11}
                    stroke={chartColors.axis}
                    tickLine={false}
                    axisLine={false}
                    width={32}
                    domain={["dataMin - 20", "dataMax + 20"]}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area
                    type="monotone"
                    dataKey="seconds"
                    stroke={chartColors.primary}
                    strokeWidth={2}
                    fill="url(#cycleFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function SafetyRow({
  icon,
  label,
  ok,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  ok: boolean;
  detail: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="inline-flex items-center gap-2 text-muted-foreground">
        {icon}
        <span>{label}</span>
      </span>
      <Badge variant={ok ? "success" : "destructive"}>{detail}</Badge>
    </div>
  );
}

function Stat({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 font-semibold tabular-nums">
        {value}
        {unit ? (
          <span className="ml-1 text-xs font-normal text-muted-foreground">
            {unit}
          </span>
        ) : null}
      </p>
    </div>
  );
}
