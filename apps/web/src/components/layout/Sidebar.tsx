import { NavLink } from "react-router-dom";
import {
  Activity,
  Cpu,
  GaugeCircle,
  LayoutDashboard,
  ListChecks,
  ScrollText,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/sessions", label: "Session Logs", icon: ScrollText },
  { to: "/performance", label: "Performance", icon: Activity },
  { to: "/requirements", label: "Requirements", icon: ListChecks },
  { to: "/pipeline", label: "Model Pipeline", icon: Sparkles },
  { to: "/hardware", label: "Hardware", icon: Cpu },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex md:flex-col md:w-64 shrink-0 border-r border-border/60 bg-gradient-to-b from-white via-nailbot-blush/30 to-nailbot-pink/30 backdrop-blur-sm">
      <div className="px-6 py-6 flex items-center gap-3">
        <div className="size-9 rounded-xl bg-gradient-to-br from-nailbot-rose to-nailbot-burgundy grid place-items-center text-white shadow-md shadow-nailbot-rose/30">
          <GaugeCircle className="size-5" />
        </div>
        <div>
          <p className="text-base font-semibold tracking-tight text-nailbot-burgundy">
            NailBot
          </p>
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Robotics Console
          </p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-white text-nailbot-burgundy shadow-sm shadow-nailbot-rose/15 ring-1 ring-nailbot-pink/40"
                  : "text-muted-foreground hover:bg-white/60 hover:text-foreground",
              )
            }
          >
            <Icon className="size-4 shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mx-3 mb-4 rounded-xl border border-nailbot-pink/40 bg-white/70 p-3 text-xs">
        <p className="font-semibold text-nailbot-burgundy">Dry-run mode</p>
        <p className="mt-1 text-muted-foreground leading-snug">
          Servo commands are printed, not driven. Pass <code className="rounded bg-secondary px-1">--live</code> to
          run on hardware.
        </p>
      </div>
    </aside>
  );
}
