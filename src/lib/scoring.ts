import type { LocationIntel, Poi, PoiKind, SiteScores } from "./types";

const FOOD_RE =
  /resto|restaurant|cafe|coffee|kape|bakery|panaderia|food|carinderia|fast.?food|grill|bar|milk.?tea|dessert/i;
const WASH_RE = /car.?wash|auto|garage|repair/i;
const RETAIL_RE = /sari-?sari|store|retail|minimart|grocery|water.?refill/i;
const LODGING_RE = /hotel|inn|lodging|hostel|apartment|boarding/i;

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(n)));
}

export function classifyTag(amenity?: string, shop?: string, highway?: string): {
  kind: PoiKind;
  tag: string;
} {
  const a = (amenity ?? "").toLowerCase();
  const s = (shop ?? "").toLowerCase();
  const h = (highway ?? "").toLowerCase();
  if (["restaurant", "cafe", "fast_food", "bar", "food_court", "ice_cream"].includes(a) || s === "bakery")
    return { kind: "food", tag: a || s };
  if (["school", "university", "college", "kindergarten"].includes(a))
    return { kind: "school", tag: a };
  if (["hospital", "clinic", "doctors", "pharmacy", "dentist"].includes(a) || s === "chemist")
    return { kind: "health", tag: a || s };
  if (h === "bus_stop" || a === "bus_station" || a === "taxi")
    return { kind: "transit", tag: h || a };
  if (["bank", "atm"].includes(a) || s === "money_lender")
    return { kind: "finance", tag: a || s };
  if (s || a === "marketplace") return { kind: "shop", tag: s || a };
  return { kind: "other", tag: a || s || h || "poi" };
}

export function emptyCounts(): Record<PoiKind, number> {
  return { food: 0, shop: 0, school: 0, health: 0, transit: 0, finance: 0, other: 0 };
}

export function tally(pois: Poi[]): Record<PoiKind, number> {
  const c = emptyCounts();
  for (const p of pois) c[p.kind] += 1;
  return c;
}

export function scoreSite(intel: LocationIntel, idea: string): SiteScores {
  const { counts, pois } = intel;
  const total = pois.length;
  const density = Math.min(total / 40, 1);

  const footTraffic = clamp(
    18 + counts.transit * 8 + counts.school * 6 + counts.shop * 2.2 + counts.food * 1.4 + counts.finance * 3,
  );

  let competitionRaw = counts.food * 6 + counts.shop * 2;
  if (FOOD_RE.test(idea)) competitionRaw = counts.food * 11 + counts.shop * 1.5;
  else if (RETAIL_RE.test(idea)) competitionRaw = counts.shop * 8 + counts.food * 2;
  else if (WASH_RE.test(idea)) competitionRaw = 25 + counts.shop * 1.5;
  else if (LODGING_RE.test(idea)) competitionRaw = 20 + counts.food * 2;
  const competition = clamp(competitionRaw);

  const access = clamp(20 + counts.transit * 14 + counts.finance * 4 + density * 20);
  const demand = clamp(
    16 + counts.school * 10 + counts.shop * 3 + counts.health * 5 + counts.food * 2 + density * 18,
  );

  const overall = clamp(
    footTraffic * 0.28 + demand * 0.27 + access * 0.2 + (100 - competition) * 0.25,
  );

  return { footTraffic, competition, access, demand, overall };
}

export function scoreLabel(n: number) {
  if (n >= 75) return "Strong";
  if (n >= 55) return "Viable";
  if (n >= 40) return "Mixed";
  return "Thin";
}

export function kindLabel(kind: PoiKind) {
  switch (kind) {
    case "food":
      return "Food & drink";
    case "shop":
      return "Retail";
    case "school":
      return "Schools";
    case "health":
      return "Health";
    case "transit":
      return "Transit";
    case "finance":
      return "Banks / ATM";
    default:
      return "Other";
  }
}
