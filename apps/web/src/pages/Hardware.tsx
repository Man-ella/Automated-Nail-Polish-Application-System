import {
  Camera,
  ClipboardCheck,
  Cog,
  Cpu,
  Crosshair,
  Info,
  Pencil,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeading } from "@/components/dashboard/PageHeading";
import { HardwarePill } from "@/components/dashboard/StatusPill";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useApi } from "@/hooks/useApi";
import { api } from "@/lib/api";
import { formatDateTime, cn } from "@/lib/utils";
import type { EventLog, HardwareComponent } from "@/types";

const KIND_ICON: Record<HardwareComponent["kind"], React.ElementType> = {
  motor: Cog,
  camera: Camera,
  "end-effector": Pencil,
  sensor: Crosshair,
  controller: Cpu,
};

export function HardwarePage() {
  const { data: components } = useApi(api.getHardware, []);
  const { data: calibration } = useApi(api.getCalibration, []);
  const { data: events } = useApi(api.getEventLog, []);

  const grouped = components?.reduce<Record<string, HardwareComponent[]>>(
    (acc, c) => {
      (acc[c.kind] ??= []).push(c);
      return acc;
    },
    {},
  );

  return (
    <DashboardLayout
      title="Hardware & Logging"
      subtitle="Motors, camera, end-effector, sensors, and the edge controller status board"
    >
      <PageHeading
        title="Hardware Console"
        description="Layer 0–1 sensors and actuators reporting up to the supervisory layer. Cross-reference with the calibration schedule and recent event log."
      />

      <Tabs defaultValue="components">
        <TabsList>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="calibration">Calibration</TabsTrigger>
          <TabsTrigger value="events">Event Log</TabsTrigger>
        </TabsList>

        <TabsContent value="components">
          {grouped ? (
            <div className="space-y-6">
              {(["motor", "camera", "end-effector", "sensor", "controller"] as const).map(
                (kind) => {
                  const items = grouped[kind] ?? [];
                  if (!items.length) return null;
                  return (
                    <Section
                      key={kind}
                      title={
                        kind === "end-effector"
                          ? "End-Effector"
                          : kind.charAt(0).toUpperCase() + kind.slice(1) + "s"
                      }
                    >
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map((c) => (
                          <ComponentCard key={c.id} component={c} />
                        ))}
                      </div>
                    </Section>
                  );
                },
              )}
            </div>
          ) : null}
        </TabsContent>

        <TabsContent value="calibration">
          <Card>
            <CardHeader>
              <CardTitle>Calibration Schedule</CardTitle>
              <CardDescription>
                Required before live runs. Items past their nextDue date block
                live mode.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Run</TableHead>
                    <TableHead>Next Due</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {calibration?.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ClipboardCheck className="size-4 text-muted-foreground" />
                          <span className="text-sm">{c.label}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            c.status === "ok"
                              ? "success"
                              : c.status === "due"
                              ? "warning"
                              : "destructive"
                          }
                        >
                          {c.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">
                        {formatDateTime(c.lastRun)}
                      </TableCell>
                      <TableCell className="text-xs">
                        {formatDateTime(c.nextDue)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Event Log</CardTitle>
              <CardDescription>
                Most recent events from the controller, vision stack, and sensors.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-border/60">
                {events?.map((e) => (
                  <EventRow key={e.id} event={e} />
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      {children}
    </section>
  );
}

function ComponentCard({ component: c }: { component: HardwareComponent }) {
  const Icon = KIND_ICON[c.kind] ?? Sparkles;

  return (
    <Card>
      <CardContent className="flex items-start gap-3 p-4">
        <div className="grid size-10 place-items-center rounded-lg bg-nailbot-pink/30 text-nailbot-burgundy">
          <Icon className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="truncate text-sm font-medium">{c.label}</p>
              <p className="font-mono text-[11px] text-muted-foreground">
                {c.id}
              </p>
            </div>
            <HardwarePill status={c.status} />
          </div>
          {c.metric ? (
            <div className="mt-3 flex items-center justify-between rounded-md bg-secondary/50 px-2.5 py-1.5 text-xs">
              <span className="text-muted-foreground">{c.metric.label}</span>
              <span className="font-mono">{c.metric.value}</span>
            </div>
          ) : null}
          <p className="mt-2 text-[11px] text-muted-foreground">
            Last checked {formatDateTime(c.lastChecked)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function EventRow({ event: e }: { event: EventLog }) {
  const Icon =
    e.level === "error"
      ? TriangleAlert
      : e.level === "warn"
      ? TriangleAlert
      : Info;
  const tone =
    e.level === "error"
      ? "text-rose-600"
      : e.level === "warn"
      ? "text-amber-600"
      : "text-sky-600";

  return (
    <li className="flex items-start gap-3 px-6 py-3">
      <Icon className={cn("size-4 mt-0.5", tone)} />
      <div className="min-w-0 flex-1">
        <p className="text-sm">{e.message}</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          <span className="font-mono">{e.source}</span> ·{" "}
          {formatDateTime(e.ts)}
        </p>
      </div>
      <Badge
        variant={
          e.level === "error"
            ? "destructive"
            : e.level === "warn"
            ? "warning"
            : "muted"
        }
      >
        {e.level}
      </Badge>
    </li>
  );
}
