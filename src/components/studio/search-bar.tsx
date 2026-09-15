import { useEffect, useRef, useState } from "react";
import { MapPin, Search } from "lucide-react";
import { searchPlaces } from "@/lib/geo/location-intel";
import { useStudio } from "@/lib/store";
import { Input } from "@/components/ui/input";

const SUGGESTIONS = [
  { label: "Uptown Cagayan de Oro", lat: 8.4542, lng: 124.6319 },
  { label: "Divisoria, CDO", lat: 8.4824, lng: 124.6508 },
  { label: "Cogon Market, CDO", lat: 8.4776, lng: 124.6519 },
  { label: "Xavier University, CDO", lat: 8.4854, lng: 124.6572 },
];

export function SearchBar() {
  const setPin = useStudio((s) => s.setPin);
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<{ label: string; lat: number; lng: number }[]>([]);
  const [open, setOpen] = useState(false);
  const skipSearch = useRef(false);

  useEffect(() => {
    if (skipSearch.current) {
      skipSearch.current = false;
      return;
    }
    if (q.trim().length < 2) {
      setHits([]);
      return;
    }
    const t = setTimeout(async () => {
      const rows = await searchPlaces({ data: { q } });
      setHits(rows);
      setOpen(true);
    }, 380);
    return () => clearTimeout(t);
  }, [q]);

  function pick(lat: number, lng: number, label?: string) {
    skipSearch.current = true;
    setPin({ lat, lng });
    if (label) setQ(label);
    setHits([]);
    setOpen(false);
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-col items-center gap-2 p-3 pt-[max(0.75rem,env(safe-area-inset-top))] pl-16 md:p-5">
      <div className="pointer-events-auto relative w-full max-w-xl">
        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-subtle" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => hits.length && setOpen(true)}
          placeholder="Search a street, barangay, or city"
          className="h-12 rounded-xl bg-surface/95 pl-10 pr-3 shadow-border backdrop-blur-sm"
          aria-label="Search location"
        />
        {open && hits.length > 0 && (
          <ul className="absolute mt-2 w-full overflow-hidden rounded-xl bg-surface shadow-border">
            {hits.map((h) => (
              <li key={`${h.lat}-${h.lng}-${h.label}`}>
                <button
                  type="button"
                  className="flex w-full items-start gap-2 px-3 py-3 text-left text-sm hover:bg-surface-2"
                  onClick={() => pick(h.lat, h.lng, h.label)}
                >
                  <MapPin className="mt-0.5 size-4 shrink-0 text-muted" />
                  <span className="text-fg">{h.label}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="pointer-events-auto flex w-full max-w-xl gap-2 overflow-x-auto pb-1">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => pick(s.lat, s.lng, s.label)}
            className="shrink-0 rounded-full bg-surface/90 px-3 py-2 text-xs text-muted shadow-border hover:text-fg"
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
