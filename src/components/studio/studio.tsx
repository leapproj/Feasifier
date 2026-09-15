import { useState } from "react";
import { HeatLegend } from "./legend";
import { MapCanvas, type GoogleLayer } from "./map-canvas";
import { PrintReport } from "./print-report";
import { PromptDock } from "./prompt-dock";
import { SearchBar } from "./search-bar";
import { Sidebar } from "./sidebar";
import { StudyPanel } from "./study-panel";

export function Studio() {
  const [layer, setLayer] = useState<GoogleLayer>("roadmap");
  return (
    <div className="flex h-dvh overflow-hidden bg-bg print:block print:h-auto print:overflow-visible">
      <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden print:hidden">
        <Sidebar />
        <main className="relative min-w-0 flex-1">
          <MapCanvas layer={layer} />
          <SearchBar />
          <HeatLegend layer={layer} onLayer={setLayer} />
          <PromptDock />
          <StudyPanel />
        </main>
      </div>
      <PrintReport />
    </div>
  );
}
