import { BarChart3, Printer, X } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { rankAlternatives } from "@/lib/alternatives";
import { kindLabel, scoreLabel } from "@/lib/scoring";
import { useStudio } from "@/lib/store";
import type { FsVerdict, PoiKind } from "@/lib/types";
import { php } from "@/lib/utils";

const VERDICT: Record<FsVerdict, { label: string; variant: "go" | "caution" | "nogo" }> = {
  go: { label: "Feasible", variant: "go" },
  caution: { label: "Proceed with care", variant: "caution" },
  "no-go": { label: "Weak site", variant: "nogo" },
};

function Meter({ label, value, invert }: { label: string; value: number; invert?: boolean }) {
  const tone = invert
    ? value >= 75
      ? "bg-nogo"
      : value >= 50
        ? "bg-caution"
        : "bg-go"
    : value >= 70
      ? "bg-go"
      : value >= 45
        ? "bg-caution"
        : "bg-nogo";
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-xs">
        <span className="text-muted">{label}</span>
        <span className="font-mono tabular-nums text-fg">
          {value} · {scoreLabel(invert ? 100 - value : value)}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function StudyPanel() {
  const report = useStudio((s) => s.report);
  const scores = useStudio((s) => s.scores);
  const intel = useStudio((s) => s.intel);
  const generating = useStudio((s) => s.generating);
  const error = useStudio((s) => s.error);
  const idea = useStudio((s) => s.idea);
  const setReport = useStudio((s) => s.setReport);
  const setError = useStudio((s) => s.setError);

  if (!intel && !generating && !report) return null;

  const open = Boolean(report || generating || error);
  if (!open) {
    return (
      <aside className="pointer-events-none absolute top-32 right-3 z-20 hidden w-72 md:block">
        {intel && scores && (
          <div className="pointer-events-auto rounded-2xl bg-surface/95 p-4 shadow-border backdrop-blur-sm">
            <p className="text-xs uppercase tracking-widest text-subtle">Site read</p>
            <p className="mt-1 font-display text-xl text-fg">
              {intel.neighbourhood || intel.city || "Pinned site"}
            </p>
            <p className="mt-1 line-clamp-2 text-xs text-muted">{intel.displayName}</p>
            <div className="mt-4 space-y-3">
              <Meter label="Foot traffic" value={scores.footTraffic} />
              <Meter label="Demand" value={scores.demand} />
              <Meter label="Access" value={scores.access} />
              <Meter label="Competition" value={scores.competition} invert />
            </div>
          </div>
        )}
      </aside>
    );
  }

  return (
    <aside
      id="study-print"
      className="absolute inset-x-0 bottom-0 z-30 flex h-4/5 flex-col rounded-t-2xl bg-surface shadow-border md:inset-y-0 md:right-0 md:left-auto md:h-auto md:w-[26.25rem] md:rounded-none md:border-l md:border-border"
    >
      <header className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-widest text-subtle">Feasibility study</p>
          <h2 className="mt-0.5 truncate font-display text-xl text-fg">
            {report?.title ?? (generating ? "Research agent at work" : "Study")}
          </h2>
        </div>
        <div className="flex items-center gap-1">
          {report && (
            <Button variant="ghost" size="icon" onClick={() => window.print()} aria-label="Print study">
              <Printer />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close study"
            onClick={() => {
              setReport(null);
              setError(null);
            }}
          >
            <X />
          </Button>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {generating && (
          <ol className="space-y-3">
            {[
              "Location scout reading the block",
              "Foot-traffic proxy from shops and transit",
              "Competitor density against your idea",
              "Briefing the research agent",
              "Drafting market, permits, and numbers",
            ].map((step, i) => (
              <li key={step} className="flex gap-3 text-sm text-muted">
                <span className="font-mono tabular-nums text-subtle">{String(i + 1).padStart(2, "0")}</span>
                <span className="shimmer">{step}</span>
              </li>
            ))}
          </ol>
        )}

        {error && <p className="rounded-xl bg-nogo/10 px-3 py-3 text-sm text-nogo">{error}</p>}

        {report && scores && intel && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={VERDICT[report.verdict].variant}>{VERDICT[report.verdict].label}</Badge>
              <span className="font-mono text-sm tabular-nums text-fg">{report.feasibilityScore}/100</span>
              {idea && <span className="text-xs text-muted">{idea}</span>}
            </div>

            <p className="text-sm leading-relaxed text-fg">{report.summary}</p>

            <section className="space-y-3 rounded-xl bg-surface-2 p-3">
              <h3 className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-subtle">
                <BarChart3 className="size-3.5" /> Location
              </h3>
              <Meter label="Overall site" value={scores.overall} />
              <Meter label="Foot traffic" value={scores.footTraffic} />
              <Meter label="Demand" value={scores.demand} />
              <Meter label="Access" value={scores.access} />
              <Meter label="Competition" value={scores.competition} invert />
              <p className="text-sm text-muted">{report.location.footTraffic}</p>
              <p className="text-sm text-muted">{report.location.demographics}</p>
              <p className="text-sm text-muted">{report.location.access}</p>
            </section>

            <section>
              <h3 className="mb-2 text-xs font-medium uppercase tracking-widest text-subtle">Nearby mix</h3>
              <ul className="grid grid-cols-2 gap-2 text-xs">
                {(Object.keys(intel.counts) as PoiKind[]).map((k) => (
                  <li key={k} className="flex justify-between rounded-lg bg-surface-2 px-2.5 py-2">
                    <span className="text-muted">{kindLabel(k)}</span>
                    <span className="font-mono tabular-nums text-fg">{intel.counts[k]}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="text-xs font-medium uppercase tracking-widest text-subtle">Market</h3>
              <p className="text-sm text-fg">{report.market.demand}</p>
              <p className="text-sm text-muted">{report.market.competition}</p>
              <p className="text-sm text-muted">{report.market.positioning}</p>
            </section>

            <section>
              <h3 className="mb-3 text-xs font-medium uppercase tracking-widest text-subtle">
                Directional financials
              </h3>
              <div className="mb-3 h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Startup", v: report.financials.startupCostPhp },
                      { name: "Rev / mo", v: report.financials.monthlyRevenuePhp },
                      { name: "Opex / mo", v: report.financials.monthlyOpexPhp },
                    ]}
                  >
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "var(--color-muted)", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis hide />
                    <Tooltip
                      formatter={(v) => php(Number(v))}
                      contentStyle={{
                        background: "var(--color-surface)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 8,
                        color: "var(--color-fg)",
                      }}
                    />
                    <Bar dataKey="v" fill="var(--color-accent)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-lg bg-surface-2 px-3 py-2">
                  <dt className="text-xs text-muted">Break-even</dt>
                  <dd className="font-mono tabular-nums">{report.financials.breakEvenMonths} mo</dd>
                </div>
                <div className="rounded-lg bg-surface-2 px-3 py-2">
                  <dt className="text-xs text-muted">Year-3 ROI</dt>
                  <dd className="font-mono tabular-nums">{report.financials.year3RoiPct}%</dd>
                </div>
              </dl>
              <p className="mt-2 text-xs text-subtle">{report.financials.notes}</p>
            </section>

            <section>
              <h3 className="mb-2 text-xs font-medium uppercase tracking-widest text-subtle">Risks</h3>
              <ul className="space-y-2">
                {report.risks.map((r) => (
                  <li key={r.title} className="rounded-lg bg-surface-2 px-3 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-fg">{r.title}</span>
                      <Badge variant={r.level === "high" ? "nogo" : r.level === "medium" ? "caution" : "go"}>
                        {r.level}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted">{r.detail}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="mb-2 text-xs font-medium uppercase tracking-widest text-subtle">Permits</h3>
              <ul className="space-y-2">
                {report.permits.map((p) => (
                  <li key={p.name} className="text-sm">
                    <span className="text-fg">{p.name}</span>
                    <span className="text-muted"> — {p.note}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="mb-2 text-xs font-medium uppercase tracking-widest text-subtle">
                Alternatives ranked on this pin
              </h3>
              <ol className="space-y-2">
                {(report.alternatives?.length
                  ? report.alternatives
                  : rankAlternatives(intel, idea)
                ).map((a) => (
                  <li key={a.idea} className="rounded-lg bg-surface-2 px-3 py-2">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm text-fg">
                        <span className="font-mono text-xs text-subtle">#{a.rank}</span> {a.idea}
                      </span>
                      <span className="flex items-center gap-2">
                        <Badge variant={VERDICT[a.verdict].variant}>{VERDICT[a.verdict].label}</Badge>
                        <span className="font-mono text-xs tabular-nums text-fg">{a.score}</span>
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted">{a.why}</p>
                  </li>
                ))}
              </ol>
            </section>

            {report.technical && (
              <section className="space-y-2">
                <h3 className="text-xs font-medium uppercase tracking-widest text-subtle">Technical</h3>
                <p className="text-sm text-muted">{report.technical}</p>
              </section>
            )}

            {report.management && (
              <section className="space-y-2">
                <h3 className="text-xs font-medium uppercase tracking-widest text-subtle">Management</h3>
                <p className="text-sm text-muted">{report.management}</p>
              </section>
            )}

            <section>
              <h3 className="mb-2 text-xs font-medium uppercase tracking-widest text-subtle">What to do next</h3>
              <ol className="list-decimal space-y-1 pl-4 text-sm text-fg">
                {report.recommendations.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ol>
            </section>

            <section>
              <h3 className="mb-2 text-xs font-medium uppercase tracking-widest text-subtle">Agent log</h3>
              <ol className="space-y-2">
                {report.researchLog.map((s, i) => (
                  <li key={s.step} className="text-sm">
                    <span className="font-mono text-xs text-subtle">{String(i + 1).padStart(2, "0")} </span>
                    <span className="text-fg">{s.step}</span>
                    <p className="mt-0.5 text-xs text-muted">{s.finding}</p>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        )}
      </div>
    </aside>
  );
}
