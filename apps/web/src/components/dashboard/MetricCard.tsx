import { type ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  hint?: string;
  // delta direction relative to target. "good" = headed in target direction.
  trend?: "up" | "down" | "flat";
  trendLabel?: string;
  intent?: "good" | "warn" | "bad" | "neutral";
  icon?: ReactNode;
  children?: ReactNode;
}

const intentStyles: Record<NonNullable<MetricCardProps["intent"]>, string> = {
  good:    "text-emerald-600",
  warn:    "text-amber-600",
  bad:     "text-rose-600",
  neutral: "text-muted-foreground",
};

export function MetricCard({
  label,
  value,
  unit,
  hint,
  trend,
  trendLabel,
  intent = "neutral",
  icon,
  children,
}: MetricCardProps) {
  const TrendIcon =
    trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : Minus;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        {icon ? (
          <div className="grid size-8 place-items-center rounded-lg bg-nailbot-pink/30 text-nailbot-burgundy">
            {icon}
          </div>
        ) : null}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-semibold tracking-tight text-foreground">
            {value}
          </span>
          {unit ? (
            <span className="text-sm font-medium text-muted-foreground">
              {unit}
            </span>
          ) : null}
        </div>

        {(trend || hint) && (
          <div className="mt-2 flex items-center gap-2 text-xs">
            {trend ? (
              <span
                className={cn(
                  "inline-flex items-center gap-1 font-medium",
                  intentStyles[intent],
                )}
              >
                <TrendIcon className="size-3.5" />
                {trendLabel}
              </span>
            ) : null}
            {hint ? (
              <span className="text-muted-foreground">{hint}</span>
            ) : null}
          </div>
        )}

        {children}
      </CardContent>
    </Card>
  );
}
