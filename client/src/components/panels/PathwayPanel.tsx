import pathwayData from "@/data/pathway_expression.json";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type PathwayRecord = {
  pathway: string;
  sample: string;
  species: string;
  mean_expr: number;
};

const SPECIES_COLORS: Record<string, string> = {
  Human: "#3B82F6",
  Mouse: "#EF4444",
  "Naked Mole Rat": "#10B981",
};

const PATHWAY_DESCRIPTIONS: Record<string, string> = {
  BER: "Base Excision Repair — fixes small, non-helix-distorting base lesions from oxidative damage",
  NER: "Nucleotide Excision Repair — removes bulky DNA adducts and UV-induced lesions",
  MMR: "Mismatch Repair — corrects replication errors and base-base mismatches",
  HR: "Homologous Recombination — high-fidelity repair of double-strand breaks in S/G2 phase",
  NHEJ: "Non-Homologous End Joining — rapid but error-prone DSB repair in G1 phase",
  "Direct Reversal": "Direct chemical reversal of alkylation damage by MGMT and ALKBH enzymes",
};

export default function PathwayPanel() {
  const records = pathwayData as PathwayRecord[];
  const [selectedPathway, setSelectedPathway] = useState<string | null>(null);

  const pathways = useMemo(() => Array.from(new Set(records.map((r) => r.pathway))), [records]);

  // Build grouped data: one entry per pathway, with mean per species
  const chartData = useMemo(() => {
    return pathways.map((pw) => {
      const pwRecords = records.filter((r) => r.pathway === pw);
      const entry: Record<string, string | number> = { pathway: pw };
      ["Human", "Mouse", "Naked Mole Rat"].forEach((sp) => {
        const spRecords = pwRecords.filter((r) => r.species === sp);
        entry[sp] = spRecords.length
          ? parseFloat((spRecords.reduce((s, r) => s + r.mean_expr, 0) / spRecords.length).toFixed(3))
          : 0;
      });
      return entry;
    });
  }, [pathways, records]);

  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: { name: string; value: number; fill: string }[];
    label?: string;
  }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white border border-border rounded-lg shadow-lg p-3 text-sm max-w-xs">
        <p className="font-bold mb-1" style={{ fontFamily: "Oswald, sans-serif" }}>
          {label}
        </p>
        <p className="text-xs text-muted-foreground mb-2">
          {PATHWAY_DESCRIPTIONS[label ?? ""] ?? ""}
        </p>
        {payload.map((p) => (
          <div key={p.name} className="flex justify-between gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.fill }} />
              {p.name}
            </span>
            <span className="font-mono font-semibold">{p.value.toFixed(3)}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <div>
        <h2
          className="text-2xl font-bold uppercase tracking-wide"
          style={{ fontFamily: "Oswald, sans-serif", color: "#1e293b" }}
        >
          Pathway Expression by Species
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Mean Log₂ CPM expression of genes in each DNA repair pathway, averaged across samples per species.
        </p>
      </div>

      {/* Grouped bar chart */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle
            className="text-base uppercase tracking-wide"
            style={{ fontFamily: "Oswald, sans-serif" }}
          >
            Mean Expression per Pathway
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={380}>
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 20, bottom: 10, left: 10 }}
              barCategoryGap="25%"
              barGap={3}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="pathway"
                tick={{ fontSize: 12, fontFamily: "Inter, sans-serif" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fontFamily: "Inter, sans-serif" }}
                tickLine={false}
                axisLine={false}
                label={{
                  value: "Mean Log₂ CPM",
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                  style: { fontSize: 11, fill: "#64748b", fontFamily: "Inter, sans-serif" },
                }}
                domain={[0, "auto"]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12, fontFamily: "Inter, sans-serif" }}
                iconType="circle"
                iconSize={10}
              />
              {["Human", "Mouse", "Naked Mole Rat"].map((sp) => (
                <Bar
                  key={sp}
                  dataKey={sp}
                  fill={SPECIES_COLORS[sp]}
                  radius={[3, 3, 0, 0]}
                  maxBarSize={40}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pathway detail cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pathways.map((pw) => {
          const pwData = chartData.find((d) => d.pathway === pw);
          if (!pwData) return null;
          const humanVal = pwData["Human"] as number;
          const mouseVal = pwData["Mouse"] as number;
          const nmrVal = pwData["Naked Mole Rat"] as number;
          const maxVal = Math.max(humanVal, mouseVal, nmrVal);

          return (
            <Card
              key={pw}
              className="border shadow-sm cursor-pointer transition-all hover:shadow-md"
              onClick={() => setSelectedPathway(selectedPathway === pw ? null : pw)}
            >
              <CardHeader className="pb-2 pt-4">
                <CardTitle
                  className="text-sm uppercase tracking-wide"
                  style={{ fontFamily: "Oswald, sans-serif" }}
                >
                  {pw}
                </CardTitle>
                <p className="text-xs text-muted-foreground leading-tight">
                  {PATHWAY_DESCRIPTIONS[pw]?.split("—")[0]}
                </p>
              </CardHeader>
              <CardContent className="pb-4 space-y-2">
                {[
                  { sp: "Human", val: humanVal },
                  { sp: "Mouse", val: mouseVal },
                  { sp: "Naked Mole Rat", val: nmrVal },
                ].map(({ sp, val }) => (
                  <div key={sp}>
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="font-medium">{sp}</span>
                      <span className="font-mono text-muted-foreground">{val.toFixed(3)}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(val / maxVal) * 100}%`,
                          backgroundColor: SPECIES_COLORS[sp],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
