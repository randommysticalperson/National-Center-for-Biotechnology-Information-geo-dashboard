import { cn } from "@/lib/utils";
import {
  Activity,
  BarChart3,
  Database,
  Dna,
  FlaskConical,
  GitBranch,
  LayoutDashboard,
  Table2,
} from "lucide-react";

export type TabId =
  | "overview"
  | "pca"
  | "heatmap"
  | "pathway"
  | "violin"
  | "genes";

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const navItems: { id: TabId; label: string; icon: React.ReactNode; description: string }[] = [
  {
    id: "overview",
    label: "Overview",
    icon: <LayoutDashboard size={18} />,
    description: "Dataset summary & stats",
  },
  {
    id: "pca",
    label: "PCA Plot",
    icon: <GitBranch size={18} />,
    description: "Principal component analysis",
  },
  {
    id: "heatmap",
    label: "Heatmap",
    icon: <Activity size={18} />,
    description: "Top 50 variable genes",
  },
  {
    id: "pathway",
    label: "Pathway Expression",
    icon: <BarChart3 size={18} />,
    description: "Mean expression by pathway",
  },
  {
    id: "violin",
    label: "Violin / Box",
    icon: <FlaskConical size={18} />,
    description: "Distribution per species",
  },
  {
    id: "genes",
    label: "Gene Table",
    icon: <Table2 size={18} />,
    description: "Top 200 variable genes",
  },
];

const speciesLegend = [
  { label: "Human", color: "#3B82F6" },
  { label: "Mouse", color: "#EF4444" },
  { label: "Naked Mole Rat", color: "#10B981" },
];

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="flex flex-col w-60 min-h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border shrink-0">
      {/* Logo / title */}
      <div className="px-5 py-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="p-1.5 rounded bg-primary/20">
            <Dna size={20} className="text-primary" style={{ color: "#3B82F6" }} />
          </div>
          <span
            className="text-lg font-bold tracking-wide uppercase"
            style={{ fontFamily: "Oswald, sans-serif", color: "#e2e8f0" }}
          >
            GEO Explorer
          </span>
        </div>
        <p className="text-xs mt-1" style={{ color: "#94a3b8" }}>
          GSE75606 · DNA Repair Atlas
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-3 px-2"
          style={{ color: "#64748b" }}
        >
          Visualizations
        </p>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-all duration-150",
              activeTab === item.id
                ? "bg-sidebar-accent text-white"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}
          >
            <span
              className={cn(
                "shrink-0",
                activeTab === item.id ? "text-blue-400" : "text-slate-400"
              )}
            >
              {item.icon}
            </span>
            <div className="min-w-0">
              <p
                className="text-sm font-semibold leading-tight"
                style={{ fontFamily: "Oswald, sans-serif", letterSpacing: "0.02em" }}
              >
                {item.label}
              </p>
              <p className="text-xs truncate" style={{ color: "#64748b" }}>
                {item.description}
              </p>
            </div>
          </button>
        ))}
      </nav>

      {/* Species Legend */}
      <div className="px-5 py-4 border-t border-sidebar-border">
        <div className="flex items-center gap-1.5 mb-3">
          <Database size={13} style={{ color: "#64748b" }} />
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#64748b" }}>
            Species
          </p>
        </div>
        <div className="space-y-2">
          {speciesLegend.map((s) => (
            <div key={s.label} className="flex items-center gap-2.5">
              <span
                className="w-3 h-3 rounded-sm shrink-0"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-xs" style={{ color: "#cbd5e1" }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-sidebar-border">
        <p className="text-xs" style={{ color: "#475569" }}>
          NCBI GEO · MacRae et al. 2015
        </p>
        <p className="text-xs" style={{ color: "#334155" }}>
          Illumina HiSeq 2500 · Log₂ CPM
        </p>
      </div>
    </aside>
  );
}
