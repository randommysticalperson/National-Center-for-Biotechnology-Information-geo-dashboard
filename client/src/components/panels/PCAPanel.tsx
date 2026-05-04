import pcaData from "@/data/pca.json";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import {
  CartesianGrid,
  Label,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

const SPECIES_COLORS: Record<string, string> = {
  Human: "#3B82F6",
  Mouse: "#EF4444",
  "Naked Mole Rat": "#10B981",
};

type PCAPoint = {
  sample: string;
  species: string;
  color: string;
  pc1: number;
  pc2: number;
  pc3: number;
};

type AxisKey = "pc1" | "pc2" | "pc3";

const CustomDot = (props: {
  cx?: number;
  cy?: number;
  payload?: PCAPoint;
  r?: number;
}) => {
  const { cx = 0, cy = 0, payload, r = 10 } = props;
  if (!payload) return null;
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={SPECIES_COLORS[payload.species] ?? "#888"}
        fillOpacity={0.85}
        stroke="#fff"
        strokeWidth={2}
      />
      <text
        x={cx}
        y={cy - r - 4}
        textAnchor="middle"
        fontSize={11}
        fill="#475569"
        fontFamily="Inter, sans-serif"
      >
        {payload.sample}
      </text>
    </g>
  );
};

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: PCAPoint }[] }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-border rounded-lg shadow-lg p-3 text-sm">
      <p className="font-bold" style={{ fontFamily: "Oswald, sans-serif", color: SPECIES_COLORS[d.species] }}>
        {d.sample}
      </p>
      <p className="text-muted-foreground">{d.species}</p>
      <div className="mt-1 space-y-0.5 font-mono text-xs">
        <p>PC1: {d.pc1.toFixed(3)}</p>
        <p>PC2: {d.pc2.toFixed(3)}</p>
        <p>PC3: {d.pc3.toFixed(3)}</p>
      </div>
    </div>
  );
};

export default function PCAPanel() {
  const { points, meta } = pcaData as { points: PCAPoint[]; meta: { pc1_var: number; pc2_var: number; pc3_var: number } };

  const [xAxis, setXAxis] = useState<AxisKey>("pc1");
  const [yAxis, setYAxis] = useState<AxisKey>("pc2");

  const axisOptions: { value: AxisKey; label: string; variance: number }[] = [
    { value: "pc1", label: "PC1", variance: meta.pc1_var },
    { value: "pc2", label: "PC2", variance: meta.pc2_var },
    { value: "pc3", label: "PC3", variance: meta.pc3_var },
  ];

  // Group by species for separate Scatter series (needed for legend)
  const speciesGroups = ["Human", "Mouse", "Naked Mole Rat"].map((sp) => ({
    species: sp,
    data: points.filter((p) => p.species === sp),
  }));

  return (
    <div className="space-y-5">
      <div>
        <h2
          className="text-2xl font-bold uppercase tracking-wide"
          style={{ fontFamily: "Oswald, sans-serif", color: "#1e293b" }}
        >
          Principal Component Analysis
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          PCA of Log₂ CPM expression across all 13,181 genes. Each point is one sample, colored by species.
        </p>
      </div>

      {/* Axis selectors */}
      <div className="flex gap-4 items-center flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">X Axis</label>
          <select
            className="text-sm border border-border rounded px-2 py-1 bg-card"
            value={xAxis}
            onChange={(e) => setXAxis(e.target.value as AxisKey)}
          >
            {axisOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label} ({o.variance}%)
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Y Axis</label>
          <select
            className="text-sm border border-border rounded px-2 py-1 bg-card"
            value={yAxis}
            onChange={(e) => setYAxis(e.target.value as AxisKey)}
          >
            {axisOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label} ({o.variance}%)
              </option>
            ))}
          </select>
        </div>
      </div>

      <Card className="border shadow-sm">
        <CardContent className="pt-4">
          <ResponsiveContainer width="100%" height={460}>
            <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                dataKey={xAxis}
                name={xAxis.toUpperCase()}
                tick={{ fontSize: 12, fontFamily: "Inter, sans-serif" }}
                tickLine={false}
              >
                <Label
                  value={`${xAxis.toUpperCase()} (${meta[`${xAxis}_var` as keyof typeof meta]}% variance)`}
                  offset={-10}
                  position="insideBottom"
                  style={{ fontSize: 12, fill: "#64748b", fontFamily: "Inter, sans-serif" }}
                />
              </XAxis>
              <YAxis
                type="number"
                dataKey={yAxis}
                name={yAxis.toUpperCase()}
                tick={{ fontSize: 12, fontFamily: "Inter, sans-serif" }}
                tickLine={false}
              >
                <Label
                  value={`${yAxis.toUpperCase()} (${meta[`${yAxis}_var` as keyof typeof meta]}% variance)`}
                  angle={-90}
                  position="insideLeft"
                  style={{ fontSize: 12, fill: "#64748b", fontFamily: "Inter, sans-serif" }}
                />
              </YAxis>
              <ZAxis range={[120, 120]} />
              <Tooltip content={<CustomTooltip />} />
              {speciesGroups.map((sg) => (
                <Scatter
                  key={sg.species}
                  name={sg.species}
                  data={sg.data}
                  fill={SPECIES_COLORS[sg.species]}
                  shape={<CustomDot />}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
          {/* Manual legend */}
          <div className="flex justify-center gap-6 mt-2">
            {speciesGroups.map((sg) => (
              <div key={sg.species} className="flex items-center gap-2 text-sm">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: SPECIES_COLORS[sg.species] }}
                />
                <span>{sg.species}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Variance explained */}
      <div className="grid grid-cols-3 gap-4">
        {axisOptions.map((o) => (
          <Card key={o.value} className="border shadow-sm">
            <CardHeader className="pb-1 pt-4">
              <CardTitle
                className="text-sm uppercase tracking-wide"
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                {o.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-3xl font-bold" style={{ fontFamily: "Oswald, sans-serif" }}>
                {o.variance}%
              </p>
              <p className="text-xs text-muted-foreground">variance explained</p>
              <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${o.variance}%`, backgroundColor: "#3B82F6" }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
