import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <DashboardLayout title="404 — Off-axis" subtitle="The path is outside the workspace.">
      <div className="rounded-xl border border-dashed border-border/60 bg-white/70 p-10 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          KinematicsError
        </p>
        <p className="mt-2 text-lg font-semibold text-nailbot-burgundy">
          That route is outside the arm reach.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try returning home and starting from the overview.
        </p>
        <Button asChild className="mt-5">
          <Link to="/">Return to Overview</Link>
        </Button>
      </div>
    </DashboardLayout>
  );
}
