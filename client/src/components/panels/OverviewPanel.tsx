import summaryData from "@/data/summary.json";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Dna, FlaskConical, Layers } from "lucide-react";

const SPECIES_COLORS: Record<string, string> = {
  Human: "#3B82F6",
  Mouse: "#EF4444",
  "Naked Mole Rat": "#10B981",
};

const PATHWAY_COLORS: Record<string, string> = {
  BER: "#3B82F6",
  NER: "#8B5CF6",
  MMR: "#10B981",
  HR: "#F59E0B",
  NHEJ: "#EF4444",
  "Direct Reversal": "#06B6D4",
};

export default function OverviewPanel() {
  const summary = summaryData as {
    total_genes: number;
    total_samples: number;
    species: string[];
    samples_per_species: number;
    pathways: string[];
    pathway_gene_counts: Record<string, number>;
    top_variable_gene: string;
    normalization: string;
    platform: string;
    tissue: string;
    accession: string;
  };

  const statCards = [
    {
      icon: <Dna size={22} className="text-blue-500" />,
      label: "Total Genes",
      value: summary.total_genes.toLocaleString(),
      sub: "in expression matrix",
    },
    {
      icon: <FlaskConical size={22} className="text-emerald-500" />,
      label: "Samples",
      value: summary.total_samples,
      sub: `${summary.samples_per_species} per species`,
    },
    {
      icon: <Database size={22} className="text-violet-500" />,
      label: "Species",
      value: summary.species.length,
      sub: "comparative study",
    },
    {
      icon: <Layers size={22} className="text-amber-500" />,
      label: "Repair Pathways",
      value: summary.pathways.length,
      sub: "annotated gene sets",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-3xl font-bold tracking-wide uppercase"
          style={{ fontFamily: "Oswald, sans-serif", color: "#1e293b" }}
        >
          GSE75606 — DNA Repair Gene Expression Atlas
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Comparative RNA-seq profiling of DNA repair genes across Human, Mouse, and Naked Mole Rat liver tissue.
          MacRae et al., <em>Aging (Albany NY)</em>, 2015. PMID: 26729707.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <Card key={s.label} className="border shadow-sm">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-md bg-muted shrink-0">{s.icon}</div>
                <div>
                  <p className="text-2xl font-bold" style={{ fontFamily: "Oswald, sans-serif" }}>
                    {s.value}
                  </p>
                  <p className="text-xs font-semibold text-foreground">{s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.sub}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dataset metadata + Pathway gene counts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Metadata */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle
              className="text-base uppercase tracking-wide"
              style={{ fontFamily: "Oswald, sans-serif" }}
            >
              Dataset Metadata
            </CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <tbody>
                {[
                  ["Accession", summary.accession],
                  ["Platform", summary.platform],
                  ["Tissue", summary.tissue],
                  ["Normalization", summary.normalization],
                  ["Top Variable Gene", summary.top_variable_gene],
                ].map(([k, v]) => (
                  <tr key={k} className="border-b last:border-0">
                    <td className="py-2 pr-4 font-medium text-muted-foreground w-40">{k}</td>
                    <td className="py-2 font-mono text-xs">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Pathway gene counts */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle
              className="text-base uppercase tracking-wide"
              style={{ fontFamily: "Oswald, sans-serif" }}
            >
              Pathway Gene Counts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {summary.pathways.map((pw) => {
                const count = summary.pathway_gene_counts[pw] ?? 0;
                const max = Math.max(...Object.values(summary.pathway_gene_counts));
                const pct = Math.round((count / max) * 100);
                const color = PATHWAY_COLORS[pw] ?? "#6B7280";
                return (
                  <div key={pw}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium">{pw}</span>
                      <span className="text-muted-foreground">{count} genes</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Species badges */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle
            className="text-base uppercase tracking-wide"
            style={{ fontFamily: "Oswald, sans-serif" }}
          >
            Species in Study
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {summary.species.map((sp) => (
              <div
                key={sp}
                className="flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-medium"
                style={{ borderColor: SPECIES_COLORS[sp] + "44", backgroundColor: SPECIES_COLORS[sp] + "11" }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: SPECIES_COLORS[sp] }}
                />
                <span>{sp}</span>
                <Badge variant="secondary" className="text-xs ml-1">
                  {summary.samples_per_species} samples
                </Badge>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            All samples are liver tissue. Human lifespan ~80 years, Mouse ~3 years, Naked Mole Rat ~30 years.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
