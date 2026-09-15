import { createServerFn } from "@tanstack/react-start";
import { classifyTag, emptyCounts, tally } from "@/lib/scoring";
import type { LocationIntel, Poi } from "@/lib/types";

const UA = "Feasify/1.0 (map-based MSME feasibility research)";

type NominatimReverse = {
  display_name?: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    suburb?: string;
    neighbourhood?: string;
    quarter?: string;
    county?: string;
    state?: string;
    country?: string;
  };
};

type NominatimSearch = {
  lat: string;
  lon: string;
  display_name: string;
};

type OverpassEl = {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

async function reverseGeocode(lat: number, lng: number) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=18&addressdetails=1`;
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "application/json" },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) return null;
  return (await res.json()) as NominatimReverse;
}

async function overpassPois(lat: number, lng: number): Promise<Poi[]> {
  const q = `[out:json][timeout:16];
(
  node["amenity"~"^(restaurant|cafe|fast_food|bar|school|university|college|hospital|clinic|pharmacy|bank|atm|marketplace|place_of_worship)$"](around:850,${lat},${lng});
  node["shop"](around:850,${lat},${lng});
  node["highway"="bus_stop"](around:850,${lat},${lng});
);
out body 90;`;

  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: {
      "User-Agent": UA,
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    body: `data=${encodeURIComponent(q)}`,
    signal: AbortSignal.timeout(18000),
  });
  if (!res.ok) return [];
  const body = (await res.json()) as { elements?: OverpassEl[] };
  const pois: Poi[] = [];
  for (const el of body.elements ?? []) {
    const plat = el.lat ?? el.center?.lat;
    const plng = el.lon ?? el.center?.lon;
    if (plat == null || plng == null) continue;
    const tags = el.tags ?? {};
    const { kind, tag } = classifyTag(tags.amenity, tags.shop, tags.highway);
    pois.push({
      id: `${el.type}-${el.id}`,
      lat: plat,
      lng: plng,
      name: tags.name ?? tag.replaceAll("_", " "),
      kind,
      tag,
    });
    if (pois.length >= 120) break;
  }
  return pois;
}

export const fetchLocationIntel = createServerFn({ method: "POST" })
  .validator((input: { lat: number; lng: number }) => input)
  .handler(async ({ data }): Promise<{ ok: true; intel: LocationIntel } | { ok: false; error: string }> => {
    const { lat, lng } = data;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return { ok: false, error: "Invalid coordinates" };
    }
    try {
      const [geo, pois] = await Promise.all([
        reverseGeocode(lat, lng).catch(() => null),
        overpassPois(lat, lng).catch(() => [] as Poi[]),
      ]);
      const addr = geo?.address ?? {};
      const city =
        addr.city ?? addr.town ?? addr.village ?? addr.municipality ?? addr.county ?? addr.state ?? "";
      const neighbourhood =
        addr.neighbourhood ?? addr.suburb ?? addr.quarter ?? "";
      const intel: LocationIntel = {
        lat,
        lng,
        displayName: geo?.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        city,
        neighbourhood,
        country: addr.country ?? "",
        pois,
        counts: pois.length ? tally(pois) : emptyCounts(),
      };
      return { ok: true, intel };
    } catch {
      return { ok: false, error: "Could not read this area. Try another pin." };
    }
  });

export const searchPlaces = createServerFn({ method: "POST" })
  .validator((input: { q: string }) => input)
  .handler(async ({ data }): Promise<{ label: string; lat: number; lng: number }[]> => {
    const q = data.q.trim();
    if (q.length < 2) return [];
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=6&addressdetails=0&q=${encodeURIComponent(q)}`;
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const rows = (await res.json()) as NominatimSearch[];
    return rows.map((r) => ({
      label: r.display_name,
      lat: Number(r.lat),
      lng: Number(r.lon),
    }));
  });
