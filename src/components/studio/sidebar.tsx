import { Menu, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStudio } from "@/lib/store";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const studies = useStudio((s) => s.studies);
  const activeId = useStudio((s) => s.activeId);
  const open = useStudio((s) => s.sidebarOpen);
  const setOpen = useStudio((s) => s.setSidebarOpen);
  const loadStudy = useStudio((s) => s.loadStudy);
  const deleteStudy = useStudio((s) => s.deleteStudy);
  const newStudy = useStudio((s) => s.newStudy);

  return (
    <>
      <Button
        variant="secondary"
        size="icon"
        className="absolute top-[max(0.75rem,env(safe-area-inset-top))] left-3 z-30 md:hidden"
        aria-label="Open studies"
        onClick={() => setOpen(true)}
      >
        <Menu />
      </Button>

      {open && (
        <button
          type="button"
          className="absolute inset-0 z-40 bg-bg/50 md:hidden"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "absolute inset-y-0 left-0 z-50 flex w-72 shrink-0 flex-col border-r border-border bg-surface transition-transform duration-200 ease-out md:static md:z-10 md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex items-center gap-2.5 border-b border-border px-4 py-4">
          <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-accent-fg">
            <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
              <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="12" cy="12" r="2.2" fill="currentColor" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </span>
          <div>
            <p className="font-display text-lg leading-tight">Feasify</p>
            <p className="text-[11px] tracking-wide text-subtle">Site research studio</p>
          </div>
        </div>

        <div className="p-3">
          <Button
            className="w-full"
            onClick={() => {
              newStudy();
              setOpen(false);
            }}
          >
            <Plus /> New study
          </Button>
        </div>

        <p className="px-4 pb-2 text-xs uppercase tracking-widest text-subtle">Saved</p>
        <nav className="min-h-0 flex-1 overflow-y-auto px-2 pb-4">
          {studies.length === 0 && (
            <p className="px-2 text-sm text-muted">Pin a site and generate a study. It will live here.</p>
          )}
          <ul className="space-y-1">
            {studies.map((s) => (
              <li key={s.id} className="group relative">
                <button
                  type="button"
                  onClick={() => {
                    loadStudy(s.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full rounded-lg px-3 py-2.5 text-left hover:bg-surface-2",
                    activeId === s.id && "bg-surface-2",
                  )}
                >
                  <span className="block truncate text-sm text-fg">{s.businessIdea}</span>
                  <span className="block truncate text-xs text-subtle">
                    {s.intel.neighbourhood || s.intel.city || "Pinned site"}
                    {s.deep ? " · Deep" : ""}
                  </span>
                </button>
                <button
                  type="button"
                  aria-label="Delete study"
                  className="absolute top-2 right-2 hidden size-8 items-center justify-center rounded-md text-subtle hover:text-nogo group-hover:flex"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteStudy(s.id);
                  }}
                >
                  <Trash2 className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <p className="border-t border-border px-4 py-3 text-[11px] leading-relaxed text-subtle">
          Deep research is the paid R&D agent: longer reasoning, sensitivity, and a fuller permit path.
        </p>
      </aside>
    </>
  );
}
