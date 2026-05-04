import { useState } from "react";
import Sidebar, { TabId } from "@/components/Sidebar";
import OverviewPanel from "@/components/panels/OverviewPanel";
import PCAPanel from "@/components/panels/PCAPanel";
import HeatmapPanel from "@/components/panels/HeatmapPanel";
import PathwayPanel from "@/components/panels/PathwayPanel";
import ViolinPanel from "@/components/panels/ViolinPanel";
import GeneTablePanel from "@/components/panels/GeneTablePanel";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const renderPanel = () => {
    switch (activeTab) {
      case "overview":  return <OverviewPanel />;
      case "pca":       return <PCAPanel />;
      case "heatmap":   return <HeatmapPanel />;
      case "pathway":   return <PathwayPanel />;
      case "violin":    return <ViolinPanel />;
      case "genes":     return <GeneTablePanel />;
      default:          return <OverviewPanel />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-border px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
              style={{ fontFamily: "Oswald, sans-serif" }}
            >
              NCBI GEO
            </span>
            <span className="text-muted-foreground text-xs">›</span>
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ fontFamily: "Oswald, sans-serif", color: "#1e293b" }}
            >
              GSE75606
            </span>
            <span className="text-muted-foreground text-xs">›</span>
            <span className="text-xs text-muted-foreground capitalize">{activeTab}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Log₂ CPM · Liver RNA-seq · 3 Species · 9 Samples</span>
          </div>
        </div>

        {/* Panel content */}
        <div className="px-8 py-6">
          {renderPanel()}
        </div>
      </main>
    </div>
  );
}
