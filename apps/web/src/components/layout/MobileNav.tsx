import { NavLink } from "react-router-dom";
import {
  Activity,
  Cpu,
  LayoutDashboard,
  ListChecks,
  ScrollText,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/sessions", label: "Sessions", icon: ScrollText },
  { to: "/performance", label: "Perf", icon: Activity },
  { to: "/requirements", label: "Reqs", icon: ListChecks },
  { to: "/pipeline", label: "Pipeline", icon: Sparkles },
  { to: "/hardware", label: "Hardware", icon: Cpu },
];

export function MobileNav() {
  return (
    <nav className="md:hidden sticky top-0 z-30 -mx-6 mb-4 flex gap-1 overflow-x-auto border-b border-border/60 bg-white/85 px-6 py-2 backdrop-blur scrollbar-thin">
      {NAV.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap",
              isActive
                ? "bg-nailbot-burgundy text-white"
                : "text-muted-foreground hover:bg-secondary",
            )
          }
        >
          <Icon className="size-3.5" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
