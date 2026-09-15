import { useState } from "react";
import { FileSearch, LoaderCircle } from "lucide-react";
import { generateFeasibilityStudy } from "@/lib/ai/generate-study";
import { useStudio } from "@/lib/store";
import { uid } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const IDEAS = [
  "Coffee shop with study nooks",
  "Neighborhood bakery",
  "Sari-sari store with water refilling",
  "24-hour car wash",
  "Small lodging near campus",
];

export function PromptDock() {
  const idea = useStudio((s) => s.idea);
  const deep = useStudio((s) => s.deep);
  const pin = useStudio((s) => s.pin);
  const intel = useStudio((s) => s.intel);
  const scores = useStudio((s) => s.scores);
  const generating = useStudio((s) => s.generating);
  const report = useStudio((s) => s.report);
  const intelLoading = useStudio((s) => s.intelLoading);
  const setIdea = useStudio((s) => s.setIdea);
  const setDeep = useStudio((s) => s.setDeep);
  const setGenerating = useStudio((s) => s.setGenerating);
  const setError = useStudio((s) => s.setError);
  const setReport = useStudio((s) => s.setReport);
  const saveStudy = useStudio((s) => s.saveStudy);
  const [asked, setAsked] = useState(false);

  const ready = Boolean(pin && intel && scores && !intelLoading);
  const canGenerate = ready && idea.trim().length > 2 && !generating;

  async function generate() {
    if (!intel || !scores) return;
    setAsked(true);
    setGenerating(true);
    setError(null);
    const result = await generateFeasibilityStudy({
      data: { idea: idea.trim(), deep, intel, scores },
    });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setReport(result.report);
    saveStudy({
      id: uid(),
      createdAt: Date.now(),
      businessIdea: idea.trim(),
      deep,
      intel,
      scores,
      report: result.report,
    });
  }

  if (generating || report) return null;

  if (!pin) {
    return (
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:p-6">
        <div className="pointer-events-auto max-w-lg rounded-2xl bg-surface/95 px-5 py-4 shadow-border backdrop-blur-sm">
          <p className="font-display text-lg text-fg">Pin a lot. Prove the business.</p>
          <p className="mt-1 text-sm text-muted">
            Click the map — or search a barangay — then tell the research agent what you want to open.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:p-6">
      <div className="pointer-events-auto w-full max-w-2xl rounded-2xl bg-surface/95 p-3 shadow-border backdrop-blur-sm md:p-4">
        <div className="mb-2 flex items-center justify-between gap-3 px-1">
          <p className="text-sm font-medium text-fg">
            {asked ? "What should we test here?" : "What business do you want to do here?"}
          </p>
          <label className="flex cursor-pointer items-center gap-2 text-xs text-muted">
            <span>Deep research</span>
            <button
              type="button"
              role="switch"
              aria-checked={deep}
              onClick={() => setDeep(!deep)}
              className={`relative h-6 w-10 rounded-full transition-colors ${deep ? "bg-accent" : "bg-surface-2"}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-fg transition-transform ${deep ? "translate-x-4 bg-accent-fg" : ""}`}
              />
            </button>
          </label>
        </div>
        <Textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="e.g. a quiet coffee shop for students, 30 seats, open until 10pm"
          rows={2}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && canGenerate) {
              e.preventDefault();
              void generate();
            }
          }}
        />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {IDEAS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setIdea(item)}
              className="rounded-full bg-surface-2 px-2.5 py-1 text-xs text-muted hover:text-fg"
            >
              {item}
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs text-subtle">
            {intelLoading
              ? "Reading the block — shops, schools, transit…"
              : ready
                ? `${intel?.pois.length ?? 0} nearby places mapped`
                : "Waiting on location data"}
          </p>
          <Button size="lg" disabled={!canGenerate} onClick={() => void generate()}>
            {generating ? <LoaderCircle className="animate-spin" /> : <FileSearch />}
            {generating ? "Researching" : deep ? "Run deep study" : "Generate study"}
          </Button>
        </div>
      </div>
    </div>
  );
}
