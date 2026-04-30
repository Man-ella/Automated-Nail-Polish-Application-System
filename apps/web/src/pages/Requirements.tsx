import { CheckCircle2, Target, XCircle } from "lucide-react";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeading } from "@/components/dashboard/PageHeading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useApi } from "@/hooks/useApi";
import { api } from "@/lib/api";
import { chartColors, tooltipStyle } from "@/components/charts/chartTheme";

export function RequirementsPage() {
  const { data: reqs } = useApi(api.getRequirements, []);

  const radarData =
    reqs?.map((r) => ({ requirement: r.name, score: r.attainmentPct })) ?? [];

  const passing = reqs?.filter((r) => r.passing).length ?? 0;
  const total = reqs?.length ?? 0;

  return (
    <DashboardLayout
      title="Requirements vs Actual"
      subtitle="Phase 1C measurable specs compared to current operating performance"
    >
      <PageHeading
        title="Spec Conformance"
        description="The five Phase 1C requirements plus the IoU success metric. Each card shows the target, the live actual, and how close we are to the spec."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {reqs?.map((r) => (
            <Card key={r.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-sm">{r.name}</CardTitle>
                    <CardDescription className="mt-0.5 text-xs">
                      {r.rationale}
                    </CardDescription>
                  </div>
                  <Badge variant={r.passing ? "success" : "destructive"}>
                    {r.passing ? "Pass" : "Fail"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-semibold tabular-nums text-nailbot-burgundy">
                    {r.actual}
                    <span className="ml-1 text-sm font-normal text-muted-foreground">
                      {r.unit}
                    </span>
                  </span>
                  <span className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Target className="size-3.5" />
                    {r.target}
                  </span>
                </div>
                <Progress value={r.attainmentPct} />
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Attainment</span>
                  <span className="font-medium">{r.attainmentPct}%</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Right column: radar + headline */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Headline</CardTitle>
              <CardDescription>Spec conformance summary</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl bg-gradient-to-br from-nailbot-pink/40 to-nailbot-rose/40 p-4">
                <p className="text-xs uppercase tracking-wider text-nailbot-burgundy/70">
                  Passing
                </p>
                <p className="mt-1 text-3xl font-semibold tabular-nums text-nailbot-burgundy">
                  {passing}
                  <span className="ml-1 text-base font-normal text-nailbot-burgundy/60">
                    / {total}
                  </span>
                </p>
              </div>
              <ul className="space-y-2 text-sm">
                {reqs?.map((r) => (
                  <li key={r.id} className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {r.passing ? (
                        <CheckCircle2 className="size-4 text-emerald-600" />
                      ) : (
                        <XCircle className="size-4 text-rose-600" />
                      )}
                      <span className="truncate">{r.name}</span>
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {r.actual}
                      {r.unit}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attainment Profile</CardTitle>
              <CardDescription>% of target met per axis</CardDescription>
            </CardHeader>
            <CardContent className="h-64 pt-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="75%">
                  <PolarGrid stroke={chartColors.grid} />
                  <PolarAngleAxis
                    dataKey="requirement"
                    tick={{ fontSize: 10, fill: chartColors.axis }}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke={chartColors.primary}
                    fill={chartColors.rose}
                    fillOpacity={0.45}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
