import { Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OverviewPage } from "@/pages/Overview";
import { SessionsPage } from "@/pages/Sessions";
import { PerformancePage } from "@/pages/Performance";
import { RequirementsPage } from "@/pages/Requirements";
import { PipelinePage } from "@/pages/Pipeline";
import { HardwarePage } from "@/pages/Hardware";
import { NotFoundPage } from "@/pages/NotFound";

export default function App() {
  return (
    <TooltipProvider delayDuration={150}>
      <Routes>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/sessions" element={<SessionsPage />} />
        <Route path="/performance" element={<PerformancePage />} />
        <Route path="/requirements" element={<RequirementsPage />} />
        <Route path="/pipeline" element={<PipelinePage />} />
        <Route path="/hardware" element={<HardwarePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </TooltipProvider>
  );
}
