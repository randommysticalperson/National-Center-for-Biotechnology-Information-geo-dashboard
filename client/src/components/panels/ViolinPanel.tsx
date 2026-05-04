import violinData from "@/data/violin.json";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import {
  CartesianGrid,
  ComposedChart,
  ErrorBar,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ViolinRecord = {
  pathway: string;
  species: string;
  values: number[];
  mean: number;
  median: number;
  q1: number;
  q3: number;
  min: number;
  max: number;
};

const SPECIES_COLORS: Record<string, string> = {
  Human: "#3B82F6",
  Mouse: "#EF4444",
  "Naked Mole Rat": "#10B981",
};

const SPECIES_LIST = ["Human", "Mouse", "Naked Mole Rat"];

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: ViolinRecord & { xLabel: string } }[];
}) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-border rounded-lg shadow-lg p-3 text-sm">
      <p className="font-bold" style={{ fontFamily: "Oswald, sans-serif", color: SPECIES_COLORS[d.species] }}>
        {d.species}
      </p>
      <p className="text-muted-foreground text-xs mb-1">{d.pathway}</p>
      <div className="space-y-0.5 font-mono text-xs">
        <p>Mean: <strong>{d.mean.toFixed(3)}</strong></p>
        <p>Median: <strong>{d.median.toFixed(3)}</strong></p>
        <p>Q1: {d.q1.toFixed(3)} | Q3: {d.q3.toFixed(3)}</p>
        <p>Min: {d.min.toFixed(3)} | Max: {d.max.toFixed(3)}</p>
      </div>
    </div>
  );
};

export default function ViolinPanel() {
  const records = violinData as ViolinRecord[];
  const pathways = Array.from(new Set(records.map((r) => r.pathway)));
  const [selectedPathway, setSelectedPathway] = useState(pathways[0]);

  const filtered = records.filter((r) => r.pathway === selectedPathway);

  // Build chart data for a box-plot style scatter with error bars
  const chartData = SPECIES_LIST.map((sp, i) => {
    const rec = filtered.find((r) => r.species === sp);
    if (!rec) return null;
    return {
      ...rec,
      x: i + 1,
      xLabel: sp,
      // ErrorBar uses [lower, upper] relative to the value
      iqrLow: rec.mean - rec.q1,
      iqrHigh: rec.q3 - rec.mean,
      rangeLow: rec.mean - rec.min,
      rangeHigh: rec.max - rec.mean,
    };
  }).filter(Boolean) as (ViolinRecord & { x: number; xLabel: string; iqrLow: number; iqrHigh: number; rangeLow: number; rangeHigh: number })[];

  return (
    <div className="space-y-5">
      <div>
        <h2
          className="text-2xl font-bold uppercase tracking-wide"
          style={{ fontFamily: "Oswald, sans-serif", color: "#1e293b" }}
        >
          Expression Distribution by Species
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Box plot showing the distribution of Log₂ CPM expression values for genes in each DNA repair pathway.
          Bars show IQR (thick) and full range (thin). Dot = mean.
        </p>
      </div>

      {/* Pathway selector */}
      <div className="flex flex-wrap gap-2">
        {pathways.map((pw) => (
          <button
            key={pw}
            onClick={() => setSelectedPathway(pw)}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-all border ${
              selectedPathway === pw
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border hover:bg-muted"
            }`}
            style={{ fontFamily: "Oswald, sans-serif", letterSpacing: "0.03em" }}
          >
            {pw}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Box plot chart */}
        <Card className="border shadow-sm lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle
              className="text-base uppercase tracking-wide"
              style={{ fontFamily: "Oswald, sans-serif" }}
            >
              {selectedPathway} — Expression Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={340}>
              <ComposedChart
                data={chartData}
                margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="xLabel"
                  tick={{ fontSize: 12, fontFamily: "Inter, sans-serif" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fontFamily: "Inter, sans-serif" }}
                  tickLine={false}
                  axisLine={false}
                  label={{
                    value: "Log₂ CPM",
                    angle: -90,
                    position: "insideLeft",
                    offset: 10,
                    style: { fontSize: 11, fill: "#64748b", fontFamily: "Inter, sans-serif" },
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Scatter
                  data={chartData}
                  dataKey="mean"
                  fill="#888"
                  shape={(props: {
                    cx?: number;
                    cy?: number;
                    payload?: typeof chartData[0];
                  }) => {
                    const { cx = 0, cy = 0, payload } = props;
                    if (!payload) return <g />;
                    const color = SPECIES_COLORS[payload.species] ?? "#888";
                    const iqrTop = cy - ((payload.q3 - payload.mean) / (payload.max - payload.min)) * 200;
                    const iqrBot = cy + ((payload.mean - payload.q1) / (payload.max - payload.min)) * 200;
                    const rangeTop = cy - ((payload.max - payload.mean) / (payload.max - payload.min)) * 200;
                    const rangeBot = cy + ((payload.mean - payload.min) / (payload.max - payload.min)) * 200;
                    return (
                      <g>
                        {/* Range whisker */}
                        <line x1={cx} y1={rangeTop} x2={cx} y2={rangeBot} stroke={color} strokeWidth={1.5} strokeOpacity={0.4} />
                        {/* IQR box */}
                        <rect x={cx - 18} y={iqrTop} width={36} height={Math.abs(iqrBot - iqrTop)} fill={color} fillOpacity={0.25} stroke={color} strokeWidth={1.5} rx={2} />
                        {/* Median line */}
                        <line x1={cx - 18} y1={cy} x2={cx + 18} y2={cy} stroke={color} strokeWidth={2.5} />
                        {/* Mean dot */}
                        <circle cx={cx} cy={cy} r={5} fill={color} stroke="#fff" strokeWidth={1.5} />
                      </g>
                    );
                  }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stats table */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle
              className="text-base uppercase tracking-wide"
              style={{ fontFamily: "Oswald, sans-serif" }}
            >
              Summary Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chartData.map((d) => (
                <div key={d.species} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: SPECIES_COLORS[d.species] }}
                    />
                    <span className="text-sm font-semibold">{d.species}</span>
                  </div>
                  <table className="w-full text-xs">
                    <tbody>
                      {[
                        ["Mean", d.mean.toFixed(3)],
                        ["Median", d.median.toFixed(3)],
                        ["Q1", d.q1.toFixed(3)],
                        ["Q3", d.q3.toFixed(3)],
                        ["Min", d.min.toFixed(3)],
                        ["Max", d.max.toFixed(3)],
                      ].map(([k, v]) => (
                        <tr key={k} className="border-b last:border-0">
                          <td className="py-0.5 text-muted-foreground w-14">{k}</td>
                          <td className="py-0.5 font-mono font-medium">{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
