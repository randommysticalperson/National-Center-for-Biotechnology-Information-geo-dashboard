import geneData from "@/data/gene_table.json";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

type GeneRow = {
  gene: string;
  pathway: string;
  hs1: number; hs2: number; hs3: number;
  mm1: number; mm2: number; mm3: number;
  nmr4: number; nmr5: number; nmr6: number;
};

const PATHWAY_COLORS: Record<string, string> = {
  BER: "#3B82F6",
  NER: "#8B5CF6",
  MMR: "#10B981",
  HR: "#F59E0B",
  NHEJ: "#EF4444",
  "Direct Reversal": "#06B6D4",
  Other: "#94A3B8",
};

const SAMPLES = ["hs1", "hs2", "hs3", "mm1", "mm2", "mm3", "nmr4", "nmr5", "nmr6"] as const;
type SampleKey = typeof SAMPLES[number];

type SortKey = "gene" | "pathway" | SampleKey;
type SortDir = "asc" | "desc";

export default function GeneTablePanel() {
  const rows = geneData as GeneRow[];
  const [search, setSearch] = useState("");
  const [pathwayFilter, setPathwayFilter] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey>("gene");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 20;

  const pathways = useMemo(
    () => ["All", ...Array.from(new Set(rows.map((r) => r.pathway)))],
    [rows]
  );

  const filtered = useMemo(() => {
    let r = rows;
    if (search.trim()) {
      r = r.filter((row) => row.gene.toLowerCase().includes(search.toLowerCase()));
    }
    if (pathwayFilter !== "All") {
      r = r.filter((row) => row.pathway === pathwayFilter);
    }
    return r;
  }, [rows, search, pathwayFilter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortKey as keyof GeneRow];
      const bv = b[sortKey as keyof GeneRow];
      if (typeof av === "string" && typeof bv === "string") {
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortDir === "asc" ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
  }, [filtered, sortKey, sortDir]);

  const paged = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(0);
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronsUpDown size={12} className="text-muted-foreground" />;
    return sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
  }

  // Color cell by value
  function cellBg(val: number): string {
    const t = Math.min(Math.max((val - 2) / 8, 0), 1);
    const r = Math.round(255 - (255 - 59) * t);
    const g = Math.round(255 - (255 - 130) * t);
    const b = Math.round(255 - (255 - 246) * t);
    return `rgba(${r},${g},${b},0.35)`;
  }

  return (
    <div className="space-y-5">
      <div>
        <h2
          className="text-2xl font-bold uppercase tracking-wide"
          style={{ fontFamily: "Oswald, sans-serif", color: "#1e293b" }}
        >
          Gene Expression Table
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Top 200 most variable genes. Click column headers to sort. Color intensity encodes Log₂ CPM expression.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search gene..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          className="border border-border rounded px-3 py-1.5 text-sm bg-card w-48 focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <select
          value={pathwayFilter}
          onChange={(e) => { setPathwayFilter(e.target.value); setPage(0); }}
          className="border border-border rounded px-2 py-1.5 text-sm bg-card"
        >
          {pathways.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <span className="text-xs text-muted-foreground">
          {sorted.length} genes · Page {page + 1} / {totalPages}
        </span>
      </div>

      <Card className="border shadow-sm overflow-hidden">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted border-b">
                <th
                  className="text-left px-3 py-2.5 font-semibold cursor-pointer select-none sticky left-0 bg-muted z-10 min-w-[120px]"
                  onClick={() => handleSort("gene")}
                >
                  <div className="flex items-center gap-1">Gene <SortIcon col="gene" /></div>
                </th>
                <th
                  className="text-left px-3 py-2.5 font-semibold cursor-pointer select-none min-w-[110px]"
                  onClick={() => handleSort("pathway")}
                >
                  <div className="flex items-center gap-1">Pathway <SortIcon col="pathway" /></div>
                </th>
                {SAMPLES.map((s) => (
                  <th
                    key={s}
                    className="text-center px-2 py-2.5 font-semibold cursor-pointer select-none min-w-[52px]"
                    onClick={() => handleSort(s)}
                  >
                    <div className="flex items-center justify-center gap-0.5">
                      {s} <SortIcon col={s} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((row, i) => (
                <tr key={row.gene} className={i % 2 === 0 ? "bg-white" : "bg-muted/30"}>
                  <td className="px-3 py-1.5 font-mono font-medium sticky left-0 bg-inherit z-10">
                    {row.gene.split("_")[0]}
                  </td>
                  <td className="px-3 py-1.5">
                    <Badge
                      variant="outline"
                      className="text-xs px-1.5 py-0"
                      style={{
                        borderColor: PATHWAY_COLORS[row.pathway] + "88",
                        color: PATHWAY_COLORS[row.pathway],
                        backgroundColor: PATHWAY_COLORS[row.pathway] + "11",
                      }}
                    >
                      {row.pathway}
                    </Badge>
                  </td>
                  {SAMPLES.map((s) => (
                    <td
                      key={s}
                      className="text-center px-2 py-1.5 font-mono"
                      style={{ backgroundColor: cellBg(row[s]) }}
                    >
                      {row[s].toFixed(2)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center gap-2 justify-end">
        <button
          className="px-3 py-1 text-sm border border-border rounded bg-card hover:bg-muted disabled:opacity-40"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
        >
          Previous
        </button>
        <span className="text-sm text-muted-foreground">
          {page + 1} / {totalPages}
        </span>
        <button
          className="px-3 py-1 text-sm border border-border rounded bg-card hover:bg-muted disabled:opacity-40"
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page >= totalPages - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}
