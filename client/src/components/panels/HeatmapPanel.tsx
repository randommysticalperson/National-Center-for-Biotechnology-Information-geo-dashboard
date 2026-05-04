import heatmapData from "@/data/heatmap.json";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useMemo } from "react";

type HeatmapRecord = {
  gene: string;
  sample: string;
  value: number;
  species: string;
};

type HeatmapData = {
  genes: string[];
  samples: string[];
  records: HeatmapRecord[];
};

const SPECIES_COLORS: Record<string, string> = {
  Human: "#3B82F6",
  Mouse: "#EF4444",
  "Naked Mole Rat": "#10B981",
};

const SAMPLE_SPECIES: Record<string, string> = {
  hs1: "Human", hs2: "Human", hs3: "Human",
  mm1: "Mouse", mm2: "Mouse", mm3: "Mouse",
  nmr4: "Naked Mole Rat", nmr5: "Naked Mole Rat", nmr6: "Naked Mole Rat",
};

// Color scale: low = deep blue, mid = white, high = deep red
function expressionColor(value: number, min: number, max: number): string {
  const t = (value - min) / (max - min);
  if (t < 0.5) {
    // blue → white
    const u = t * 2;
    const r = Math.round(59 + (255 - 59) * u);
    const g = Math.round(130 + (255 - 130) * u);
    const b = Math.round(246 + (255 - 246) * u);
    return `rgb(${r},${g},${b})`;
  } else {
    // white → red
    const u = (t - 0.5) * 2;
    const r = 255;
    const g = Math.round(255 - 255 * u);
    const b = Math.round(255 - 255 * u);
    return `rgb(${r},${g},${b})`;
  }
}

export default function HeatmapPanel() {
  const data = heatmapData as HeatmapData;
  const [search, setSearch] = useState("");
  const [hoveredCell, setHoveredCell] = useState<HeatmapRecord | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const allValues = data.records.map((r) => r.value);
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);

  const filteredGenes = useMemo(
    () =>
      search.trim()
        ? data.genes.filter((g) => g.toLowerCase().includes(search.toLowerCase()))
        : data.genes,
    [search, data.genes]
  );

  // Build lookup map
  const lookup = useMemo(() => {
    const m: Record<string, number> = {};
    data.records.forEach((r) => {
      m[`${r.gene}__${r.sample}`] = r.value;
    });
    return m;
  }, [data.records]);

  const CELL_W = 52;
  const CELL_H = 18;
  const LABEL_W = 130;
  const HEADER_H = 70;

  return (
    <div className="space-y-5">
      <div>
        <h2
          className="text-2xl font-bold uppercase tracking-wide"
          style={{ fontFamily: "Oswald, sans-serif", color: "#1e293b" }}
        >
          Gene Expression Heatmap
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Top 50 most variable genes across 9 samples. Color encodes Log₂ CPM expression (blue = low, red = high).
        </p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search gene..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-border rounded px-3 py-1.5 text-sm bg-card w-56 focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <span className="text-xs text-muted-foreground">
          Showing {filteredGenes.length} of {data.genes.length} genes
        </span>
      </div>

      <Card className="border shadow-sm overflow-hidden">
        <CardContent className="pt-4 overflow-x-auto">
          <div className="relative" style={{ minWidth: LABEL_W + CELL_W * data.samples.length + 40 }}>
            {/* Sample headers */}
            <div className="flex" style={{ marginLeft: LABEL_W }}>
              {data.samples.map((s) => (
                <div
                  key={s}
                  style={{
                    width: CELL_W,
                    height: HEADER_H,
                    flexShrink: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingBottom: 4,
                  }}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-sm mb-1"
                    style={{ backgroundColor: SPECIES_COLORS[SAMPLE_SPECIES[s]] }}
                  />
                  <span
                    style={{
                      fontSize: 11,
                      fontFamily: "Inter, sans-serif",
                      color: "#475569",
                      writingMode: "vertical-rl",
                      transform: "rotate(180deg)",
                    }}
                  >
                    {s}
                  </span>
                </div>
              ))}
            </div>

            {/* Rows */}
            {filteredGenes.map((gene) => (
              <div key={gene} className="flex items-center" style={{ height: CELL_H }}>
                {/* Gene label */}
                <div
                  style={{
                    width: LABEL_W,
                    fontSize: 11,
                    fontFamily: "Inter, sans-serif",
                    color: "#334155",
                    paddingRight: 8,
                    textAlign: "right",
                    flexShrink: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={gene}
                >
                  {gene.split("_")[0]}
                </div>
                {/* Cells */}
                {data.samples.map((s) => {
                  const val = lookup[`${gene}__${s}`] ?? 0;
                  const bg = expressionColor(val, minVal, maxVal);
                  return (
                    <div
                      key={s}
                      style={{
                        width: CELL_W,
                        height: CELL_H,
                        backgroundColor: bg,
                        flexShrink: 0,
                        borderRight: "1px solid rgba(255,255,255,0.3)",
                        borderBottom: "1px solid rgba(255,255,255,0.3)",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        setHoveredCell({ gene, sample: s, value: val, species: SAMPLE_SPECIES[s] });
                        setTooltipPos({ x: e.clientX, y: e.clientY });
                      }}
                      onMouseMove={(e) => setTooltipPos({ x: e.clientX, y: e.clientY })}
                      onMouseLeave={() => setHoveredCell(null)}
                    />
                  );
                })}
              </div>
            ))}

            {/* Color scale legend */}
            <div className="flex items-center gap-3 mt-4 ml-2">
              <span className="text-xs text-muted-foreground">Low</span>
              <div
                className="h-3 rounded"
                style={{
                  width: 180,
                  background:
                    "linear-gradient(to right, rgb(59,130,246), rgb(255,255,255), rgb(255,0,0))",
                }}
              />
              <span className="text-xs text-muted-foreground">High</span>
              <span className="text-xs text-muted-foreground ml-2">
                ({minVal.toFixed(1)} – {maxVal.toFixed(1)} Log₂ CPM)
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Floating tooltip */}
      {hoveredCell && (
        <div
          className="fixed z-50 bg-white border border-border rounded-lg shadow-xl p-3 text-sm pointer-events-none"
          style={{ left: tooltipPos.x + 14, top: tooltipPos.y - 10 }}
        >
          <p className="font-bold" style={{ fontFamily: "Oswald, sans-serif" }}>
            {hoveredCell.gene.split("_")[0]}
          </p>
          <p className="text-muted-foreground">{hoveredCell.sample} · {hoveredCell.species}</p>
          <p className="font-mono text-xs mt-1">
            Log₂ CPM: <strong>{hoveredCell.value.toFixed(3)}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
