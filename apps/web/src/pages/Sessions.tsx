import { useMemo, useState } from "react";
import { Download, Filter, Search } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeading } from "@/components/dashboard/PageHeading";
import { OutcomePill } from "@/components/dashboard/StatusPill";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApi } from "@/hooks/useApi";
import { api } from "@/lib/api";
import { formatDateTime, formatDuration } from "@/lib/utils";
import type { SessionLogEntry, SessionOutcome } from "@/types";

const FILTERS: { label: string; value: SessionOutcome | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Success", value: "success" },
  { label: "Partial", value: "partial" },
  { label: "Failure", value: "failure" },
];

export function SessionsPage() {
  const { data: sessions, loading } = useApi(api.listSessions, []);
  const [filter, setFilter] = useState<SessionOutcome | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!sessions) return [];
    return sessions.filter((s) => {
      const okFilter = filter === "all" || s.outcome === filter;
      const okQuery =
        query.trim() === "" ||
        s.id.toLowerCase().includes(query.toLowerCase()) ||
        s.operator.name.toLowerCase().includes(query.toLowerCase()) ||
        s.nailProfile.label.toLowerCase().includes(query.toLowerCase()) ||
        s.modelVersion.toLowerCase().includes(query.toLowerCase());
      return okFilter && okQuery;
    });
  }, [sessions, filter, query]);

  return (
    <DashboardLayout
      title="Session Logs"
      subtitle="Trial-by-trial history with metrics, model version, and operator notes"
    >
      <PageHeading
        title="Trial History"
        description="Every painting cycle is logged with timestamp, operator, nail profile, model version, outcome, and quality metrics. Notes capture edge cases that feed the retraining queue."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Filter className="size-3.5" />
              Columns
            </Button>
            <Button size="sm">
              <Download className="size-3.5" />
              Export CSV
            </Button>
          </>
        }
      />

      <Card>
        <CardHeader className="flex flex-col gap-3 border-b border-border/60 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Sessions</CardTitle>
            <CardDescription>
              {loading
                ? "Loading…"
                : `${filtered.length} of ${sessions?.length ?? 0} trials`}
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search ID, operator, model…"
                className="h-8 w-56 rounded-md border border-input bg-background pl-8 pr-3 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="flex items-center gap-1 rounded-md bg-muted p-0.5">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={
                    filter === f.value
                      ? "rounded-sm bg-white px-2.5 py-1 text-xs font-medium shadow-sm"
                      : "px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground"
                  }
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Session</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Operator</TableHead>
                <TableHead>Profile</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Boundary</TableHead>
                <TableHead>Thickness</TableHead>
                <TableHead>Cycle</TableHead>
                <TableHead>Outcome</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <SessionRow key={s.id} session={s} />
              ))}
              {filtered.length === 0 && !loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-sm text-muted-foreground">
                    No sessions match the current filters.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

function SessionRow({ session: s }: { session: SessionLogEntry }) {
  const duration =
    s.endedAt
      ? new Date(s.endedAt).getTime() - new Date(s.startedAt).getTime()
      : null;
  const boundaryPass = s.metrics.boundaryErrorMm < 1.0;
  const thicknessPass = s.metrics.thicknessVariationPct <= 10;

  return (
    <TableRow>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-mono text-xs">{s.id}</span>
          {s.notes ? (
            <span className="mt-0.5 line-clamp-1 max-w-[24ch] text-[11px] text-muted-foreground">
              {s.notes}
            </span>
          ) : null}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className="text-xs">{formatDateTime(s.startedAt)}</span>
          {duration !== null ? (
            <span className="text-[11px] text-muted-foreground">
              {formatDuration(duration)}
            </span>
          ) : null}
        </div>
      </TableCell>
      <TableCell className="text-xs">{s.operator.name}</TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className="text-xs">{s.nailProfile.label}</span>
          <span className="text-[11px] capitalize text-muted-foreground">
            {s.nailProfile.shape}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="font-mono text-[11px]">
          {s.modelVersion}
        </Badge>
      </TableCell>
      <TableCell>
        <span
          className={
            "tabular-nums text-xs " +
            (boundaryPass ? "text-emerald-600" : "text-rose-600")
          }
        >
          {s.metrics.boundaryErrorMm.toFixed(2)} mm
        </span>
      </TableCell>
      <TableCell>
        <span
          className={
            "tabular-nums text-xs " +
            (thicknessPass ? "text-emerald-600" : "text-rose-600")
          }
        >
          ±{s.metrics.thicknessVariationPct.toFixed(1)}%
        </span>
      </TableCell>
      <TableCell className="tabular-nums text-xs">
        {(s.metrics.cycleTimeSec / 60).toFixed(2)} min
      </TableCell>
      <TableCell>
        <OutcomePill outcome={s.outcome} />
      </TableCell>
    </TableRow>
  );
}
