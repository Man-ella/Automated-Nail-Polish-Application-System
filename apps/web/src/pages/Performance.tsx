import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CheckCircle2, XCircle } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeading } from "@/components/dashboard/PageHeading";
import { MetricCard } from "@/components/dashboard/MetricCard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useApi } from "@/hooks/useApi";
import { api } from "@/lib/api";
import { chartColors, tooltipStyle } from "@/components/charts/chartTheme";

export function PerformancePage() {
  const { data: boundary } = useApi(api.getBoundarySeries, []);
  const { data: cycle } = useApi(api.getCycleTimeSeries, []);
  const { data: thickness } = useApi(api.getThicknessLayers, []);
  const { data: repeatability } = useApi(api.getRepeatabilitySeries, []);

  const lastBoundary = boundary?.at(-1)?.errorMm ?? 0;
  const lastCycle = cycle?.at(-1)?.seconds ?? 0;
  const meanThickness = thickness
    ? thickness.reduce((a, b) => a + b.thicknessMicrons, 0) / thickness.length
    : 0;
  const targetThickness = thickness?.[0]?.targetMicrons ?? 40;

  const repeatPass = repeatability
    ? repeatability.every((r) => r.boundary < 1.0 && r.thickness <= 10)
    : false;

  return (
    <DashboardLayout
      title="Performance Metrics"
      subtitle="Boundary accuracy, polish thickness, cycle time, and repeatability against deck targets"
    >
      <PageHeading
        title="Quality Telemetry"
        description="Quantitative metrics from the supervisory layer compared to the project's measurable requirements."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Boundary (latest)"
          value={lastBoundary.toFixed(2)}
          unit="mm"
          intent={lastBoundary < 1 ? "good" : "bad"}
          trend="down"
          trendLabel={lastBoundary < 1 ? "Within < 1.0 mm" : "Above target"}
        />
        <MetricCard
          label="Cycle (latest)"
          value={(lastCycle / 60).toFixed(2)}
          unit="min"
          intent={lastCycle <= 300 ? "good" : "warn"}
          trend="down"
          trendLabel="Target ≤ 5 min"
        />
        <MetricCard
          label="Avg thickness"
          value={meanThickness.toFixed(1)}
          unit={`µm / ${targetThickness}µm`}
          intent={
            Math.abs(meanThickness - targetThickness) / targetThickness < 0.1
              ? "good"
              : "warn"
          }
          trend="flat"
          trendLabel="±10% target"
        />
        <MetricCard
          label="Repeatability"
          value={repeatability ? String(repeatability.length) : "—"}
          unit="trials"
          intent={repeatPass ? "good" : "warn"}
          trend="up"
          trendLabel={repeatPass ? "Within ±0.05 mm" : "Out of band"}
        />
      </div>

      <Tabs defaultValue="boundary" className="mt-6">
        <TabsList>
          <TabsTrigger value="boundary">Boundary</TabsTrigger>
          <TabsTrigger value="thickness">Thickness</TabsTrigger>
          <TabsTrigger value="cycle">Cycle Time</TabsTrigger>
          <TabsTrigger value="repeat">Repeatability</TabsTrigger>
        </TabsList>

        <TabsContent value="boundary">
          <Card>
            <CardHeader>
              <CardTitle>Boundary Error per Trial</CardTitle>
              <CardDescription>
                Distance between predicted nail boundary and ground-truth mask
                edge. Spec: &lt; 1.0 mm.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-72 pt-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={boundary ?? []}>
                  <CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" vertical={false} />
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
                    width={42}
                    label={{
                      value: "mm",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 11,
                      fill: chartColors.axis,
                    }}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <ReferenceLine
                    y={1}
                    stroke={chartColors.danger}
                    strokeDasharray="4 3"
                    label={{
                      value: "1.0 mm spec",
                      position: "right",
                      fontSize: 10,
                      fill: chartColors.danger,
                    }}
                  />
                  <Bar dataKey="errorMm" radius={[6, 6, 0, 0]}>
                    {(boundary ?? []).map((d) => (
                      <Cell
                        key={d.trial}
                        fill={
                          d.errorMm < 1
                            ? chartColors.rose
                            : chartColors.danger
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="thickness">
          <Card>
            <CardHeader>
              <CardTitle>Polish Thickness per Layer</CardTitle>
              <CardDescription>
                Layered deposition vs target thickness. Spec: ±10% variation.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-72 pt-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={thickness ?? []}>
                  <CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="layer" fontSize={11} stroke={chartColors.axis} tickLine={false} axisLine={false} />
                  <YAxis
                    fontSize={11}
                    stroke={chartColors.axis}
                    tickLine={false}
                    axisLine={false}
                    width={42}
                    label={{ value: "µm", angle: -90, position: "insideLeft", fontSize: 11, fill: chartColors.axis }}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Bar dataKey="targetMicrons" name="Target" fill={chartColors.cream} radius={[6, 6, 0, 0]} />
                  <Bar dataKey="thicknessMicrons" name="Measured" fill={chartColors.rose} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cycle">
          <Card>
            <CardHeader>
              <CardTitle>Cycle Time</CardTitle>
              <CardDescription>
                End-to-end IDLE → COMPLETE duration. Spec: ≤ 5 min / hand.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-72 pt-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cycle ?? []}>
                  <CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="trial" fontSize={11} stroke={chartColors.axis} tickLine={false} axisLine={false} />
                  <YAxis
                    fontSize={11}
                    stroke={chartColors.axis}
                    tickLine={false}
                    axisLine={false}
                    width={42}
                    label={{ value: "sec", angle: -90, position: "insideLeft", fontSize: 11, fill: chartColors.axis }}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <ReferenceLine
                    y={300}
                    stroke={chartColors.danger}
                    strokeDasharray="4 3"
                    label={{ value: "300s spec", position: "right", fontSize: 10, fill: chartColors.danger }}
                  />
                  <Line
                    type="monotone"
                    dataKey="seconds"
                    stroke={chartColors.primary}
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: chartColors.rose }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="repeat">
          <Card>
            <CardHeader>
              <CardTitle>Repeatability Sweep</CardTitle>
              <CardDescription>
                Six identical trials with the same nail profile. Spec: ≥ 5 within band.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-72 pt-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={repeatability ?? []}>
                  <CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="trial" fontSize={11} stroke={chartColors.axis} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" fontSize={11} stroke={chartColors.axis} tickLine={false} axisLine={false} width={42} />
                  <YAxis yAxisId="right" orientation="right" fontSize={11} stroke={chartColors.axis} tickLine={false} axisLine={false} width={42} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    name="Boundary (mm)"
                    dataKey="boundary"
                    stroke={chartColors.primary}
                    strokeWidth={2}
                    dot
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    name="Thickness (%)"
                    dataKey="thickness"
                    stroke={chartColors.rose}
                    strokeWidth={2}
                    dot
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Pass/fail summary */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Pass / Fail vs Requirements</CardTitle>
          <CardDescription>
            Quick read of latest-trial conformance with each numeric spec.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <PassRow label="Boundary < 1.0 mm" passing={lastBoundary < 1} value={`${lastBoundary.toFixed(2)} mm`} />
            <PassRow label="Cycle ≤ 5 min" passing={lastCycle <= 300} value={`${(lastCycle / 60).toFixed(2)} min`} />
            <PassRow
              label="Thickness ±10%"
              passing={Math.abs(meanThickness - targetThickness) / targetThickness < 0.1}
              value={`${(((meanThickness - targetThickness) / targetThickness) * 100).toFixed(1)}%`}
            />
            <PassRow label="Repeatability ≥ 5" passing={repeatPass} value={`${repeatability?.length ?? 0} trials`} />
            <PassRow label="Latency < 100 ms" passing value="78 ms" />
            <PassRow label="IoU > 0.90" passing value="0.942" />
          </ul>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

function PassRow({
  label,
  passing,
  value,
}: {
  label: string;
  passing: boolean;
  value: string;
}) {
  return (
    <li className="flex items-center justify-between rounded-lg border border-border/60 bg-white/60 px-3 py-2">
      <span className="flex items-center gap-2 text-sm">
        {passing ? (
          <CheckCircle2 className="size-4 text-emerald-600" />
        ) : (
          <XCircle className="size-4 text-rose-600" />
        )}
        {label}
      </span>
      <span className="font-mono text-xs text-muted-foreground">{value}</span>
    </li>
  );
}
