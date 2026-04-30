import { type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileNav } from "./MobileNav";

interface DashboardLayoutProps {
  title: string;
  subtitle?: string;
  state?: string;
  children: ReactNode;
}

export function DashboardLayout({
  title,
  subtitle,
  state,
  children,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} subtitle={subtitle} state={state} />
        <main className="flex-1 px-6 py-6 lg:px-8">
          <MobileNav />
          {children}
        </main>
      </div>
    </div>
  );
}
