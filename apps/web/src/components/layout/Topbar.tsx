import { Bell, Search, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TopbarProps {
  title: string;
  subtitle?: string;
  state?: string;
}

export function Topbar({ title, subtitle, state = "APPLY_LAYER" }: TopbarProps) {
  return (
    <header className="flex flex-col gap-3 border-b border-border/60 bg-white/70 px-6 py-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="truncate text-xl font-semibold tracking-tight text-nailbot-burgundy sm:text-2xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden lg:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search sessions, models, components…"
            className="h-9 w-72 rounded-md border border-input bg-background/60 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <Badge
          variant="success"
          className="hidden gap-1.5 px-2.5 py-1 sm:inline-flex"
        >
          <ShieldCheck className="size-3.5" />
          Safety OK
        </Badge>

        <div className="flex items-center gap-2 rounded-full border border-nailbot-pink/40 bg-white px-3 py-1 text-xs">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-pulse-soft rounded-full bg-nailbot-rose opacity-70" />
            <span className="relative inline-flex size-2 rounded-full bg-nailbot-burgundy" />
          </span>
          <span className="font-mono text-[11px] tracking-tight text-nailbot-burgundy">
            {state}
          </span>
        </div>

        <Button size="icon" variant="outline" aria-label="Notifications">
          <Bell />
        </Button>

        <div className="flex items-center gap-2 rounded-full bg-nailbot-burgundy px-1 py-1 pr-3 text-white">
          <span className="grid size-7 place-items-center rounded-full bg-white text-xs font-semibold text-nailbot-burgundy">
            DI
          </span>
          <span className="hidden text-xs font-medium sm:inline">Diane</span>
        </div>
      </div>
    </header>
  );
}
