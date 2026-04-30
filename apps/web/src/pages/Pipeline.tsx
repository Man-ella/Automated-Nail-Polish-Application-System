import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Boxes,
  CheckCircle2,
  Database,
  GitBranch,
  ImageOff,
  RefreshCw,
  Tag,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeading } from "@/components/dashboard/PageHeading";
import { MetricCard } from "@/components/dashboard/MetricCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/useApi";
import { api } from "@/lib/api";
import { formatDateTime } from "@/lib/utils";
import { chartColors, tooltipStyle } from "@/components/charts/chartTheme";

export function PipelinePage() {
  const { data: stats } = useApi(api.getDatasetStats, []);
  const { data: models } = useApi(api.getModelVersions, []);
  const { data: readiness } = useApi(api.getRetrainingReadiness, []);
  const { data: failed } = useApi(api.getFailedSamples, []);

  const labelDist = stats
    ? [
        { name: "Labeled", value: stats.labeled, color: chartColors.primary },
        { name: "Unlabeled", value: stats.unlabeled, color: chartColors.cream },
      ]
    : [];

  const iouHistory =
    models?.map((m) => ({ version: m.version, iou: +(m.iou * 100).toFixed(1) })) ?? [];

  return (
    <DashboardLayout
      title="Model & Retraining Pipeline"
      subtitle="Dataset health, version history, and retraining readiness for the U-Net segmentation model"
    >
      <PageHeading
        title="Closed-Loop Improvement"
        description="Edge cases and failures are routed back into the labeling queue. When readiness thresholds are met, retraining is triggered to ship a new model version."
        actions={
          <Button size="sm" disabled={readiness ? readiness.score < 80 : true}>
            <RefreshCw className="size-3.5" />
            Trigger Retraining
          </Button>
        }
      />

      {/* Top stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Samples"
          value={stats ? stats.totalSamples.toLocaleString() : "—"}
          icon={<Database className="size-4" />}
        />
        <MetricCard
          label="Labeled"
          value={
            stats ? `${((stats.labeled / stats.totalSamples) * 100).toFixed(1)}%` : "—"
          }
          hint={stats ? `${stats.labeled} / ${stats.totalSamples}` : undefined}
          icon={<Tag className="size-4" />}
          intent="good"
        />
        <MetricCard
          label="Edge Cases"
          value={stats ? String(stats.edgeCases) : "—"}
          hint="Flagged for retraining"
          icon={<ImageOff className="size-4" />}
          intent="warn"
        />
        <MetricCard
          label="Pending Review"
          value={stats ? String(stats.pendingReview) : "—"}
          hint="Labeling queue"
          icon={<Boxes className="size-4" />}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Readiness */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Retraining Readiness</CardTitle>
            <CardDescription>Combined trigger score</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl bg-nailbot-plum p-4 text-white">
              <p className="text-xs uppercase tracking-wider text-nailbot-pink">
                Score
              </p>
              <p className="mt-1 text-4xl font-semibold tabular-nums">
                {readiness?.score ?? 0}
                <span className="ml-1 text-base font-normal text-nailbot-pink/80">
                  / 100
                </span>
              </p>
              <Progress
                value={readiness?.score ?? 0}
                className="mt-3 bg-white/10"
              />
            </div>
            <ul className="space-y-2 text-sm">
              {readiness?.thresholdsMet.map((t) => (
                <li
                  key={t.label}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="flex items-start gap-2">
                    <CheckCircle2
                      className={
                        "size-4 mt-0.5 " +
                        (t.met ? "text-emerald-600" : "text-muted-foreground/50")
                      }
                    />
                    <span className={t.met ? "" : "text-muted-foreground"}>
                      {t.label}
                    </span>
                  </span>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {t.detail}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Dataset distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Dataset Coverage</CardTitle>
            <CardDescription>Labeled vs unlabeled split</CardDescription>
          </CardHeader>
          <CardContent className="h-64 pt-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={labelDist}
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                >
                  {labelDist.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="-mt-4 flex justify-center gap-4 text-xs">
              {labelDist.map((d) => (
                <span key={d.name} className="inline-flex items-center gap-1.5">
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: d.color }}
                  />
                  {d.name}: {d.value.toLocaleString()}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* IoU history */}
        <Card>
          <CardHeader>
            <CardTitle>IoU by Model Version</CardTitle>
            <CardDescription>
              Higher is better. Newer models must beat baseline.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64 pt-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={iouHistory}>
                <CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="version" fontSize={10} stroke={chartColors.axis} tickLine={false} axisLine={false} />
                <YAxis
                  domain={[80, 100]}
                  fontSize={11}
                  stroke={chartColors.axis}
                  tickLine={false}
                  axisLine={false}
                  width={32}
                />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v}%`} />
                <Bar dataKey="iou" fill={chartColors.rose} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Versions */}
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle>Model Version History</CardTitle>
            <CardDescription>
              Each version's release time, segmentation metrics, and rollout status.
            </CardDescription>
          </div>
          <Badge variant="outline" className="font-mono text-xs">
            <GitBranch className="size-3" />
            main
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Version</TableHead>
                <TableHead>Released</TableHead>
                <TableHead>IoU</TableHead>
                <TableHead>Pixel Acc.</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {models?.map((m) => (
                <TableRow key={m.version}>
                  <TableCell className="font-mono text-xs">{m.version}</TableCell>
                  <TableCell className="text-xs">
                    {formatDateTime(m.releasedAt)}
                  </TableCell>
                  <TableCell className="tabular-nums text-xs">
                    {(m.iou * 100).toFixed(1)}%
                  </TableCell>
                  <TableCell className="tabular-nums text-xs">
                    {(m.pixelAcc * 100).toFixed(1)}%
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        m.status === "deployed"
                          ? "success"
                          : m.status === "candidate"
                          ? "default"
                          : "muted"
                      }
                    >
                      {m.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {m.notes ?? "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Failed samples */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Failed / Edge-Case Samples</CardTitle>
          <CardDescription>
            Auto-collected during sessions whenever quality metrics drift. These
            land in the labeling queue.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sample ID</TableHead>
                <TableHead>From Trial</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {failed?.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="font-mono text-xs">{f.id}</TableCell>
                  <TableCell className="font-mono text-xs">{f.trial}</TableCell>
                  <TableCell className="text-sm">{f.reason}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      <Tag className="size-3.5" />
                      Send to labeling
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
