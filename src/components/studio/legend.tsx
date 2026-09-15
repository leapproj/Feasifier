import type { GoogleLayer } from "./map-canvas";

export function HeatLegend({
  layer,
  onLayer,
}: {
  layer: GoogleLayer;
  onLayer: (layer: GoogleLayer) => void;
}) {
  const items = [
    { label: "Food & drink", color: "bg-nogo" },
    { label: "Schools / demand", color: "bg-go" },
    { label: "Transit", color: "bg-accent" },
    { label: "Retail", color: "bg-muted" },
  ];
  return (
    <div className="pointer-events-auto absolute bottom-44 left-3 z-20 rounded-xl bg-surface/90 px-3 py-2 shadow-border md:bottom-40">
      <div className="mb-2 flex gap-1 rounded-lg bg-surface-2 p-0.5">
        <button
          type="button"
          className={`rounded-md px-2 py-1 text-xs ${layer === "roadmap" ? "bg-accent text-accent-fg" : "text-muted"}`}
          onClick={() => onLayer("roadmap")}
        >
          Map
        </button>
        <button
          type="button"
          className={`rounded-md px-2 py-1 text-xs ${layer === "satellite" ? "bg-accent text-accent-fg" : "text-muted"}`}
          onClick={() => onLayer("satellite")}
        >
          Satellite
        </button>
      </div>
      <p className="mb-1.5 text-[10px] uppercase tracking-widest text-subtle">Heat mix</p>
      <ul className="space-y-1">
        {items.map((i) => (
          <li key={i.label} className="flex items-center gap-2 text-xs text-muted">
            <span className={`size-2 rounded-full ${i.color}`} />
            {i.label}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[10px] text-subtle">Google Map</p>
    </div>
  );
}
