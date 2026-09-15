import { scoreSite } from "@/lib/scoring";
import type { AlternativeIdea, FsVerdict, LocationIntel } from "@/lib/types";

export type { AlternativeIdea };

const CATALOG: { idea: string; why: (intel: LocationIntel) => string }[] = [
  {
    idea: "Coffee shop with study nooks",
    why: (i) =>
      i.counts.school
        ? `Schools on the block (${i.counts.school}) feed all-day seating demand.`
        : "Works where walk-up density is already there; keep the menu short.",
  },
  {
    idea: "Neighborhood bakery",
    why: (i) =>
      i.counts.shop + i.counts.food
        ? "Morning traffic from shops and eateries supports a bake-and-go window."
        : "A destination bake can work if you own the morning ritual on this street.",
  },
  {
    idea: "Sari-sari store with water refilling",
    why: (i) =>
      i.counts.shop >= 8
        ? "Retail is thick here — bundle water and load so you are not a pure price war."
        : "Low shop count means a convenience node can still be the nearest stop.",
  },
  {
    idea: "24-hour car wash",
    why: (i) =>
      i.counts.transit
        ? "Vehicle corridors near transit can fill a wash bay; test evening volume."
        : "Needs a road with parking. Count cars before signing a lot.",
  },
  {
    idea: "Small lodging near campus",
    why: (i) =>
      i.counts.school
        ? "Campus adjacency is the whole thesis — boarding and short-stay."
        : "Without a school magnet, lodging needs a hospital, port, or highway.",
  },
  {
    idea: "Laundry / wash-and-fold",
    why: (i) =>
      i.counts.school || i.counts.shop
        ? "Students and dense housing generate repeat, not one-off, visits."
        : "Works in walk-up barangays even when food competition is high.",
  },
  {
    idea: "Tutorial / review nook",
    why: (i) =>
      i.counts.school
        ? "Direct capture from nearby schools; after-class hours are the peak."
        : "Weak without a school cluster — skip unless you already have a teacher roster.",
  },
  {
    idea: "Pharmacy window",
    why: (i) =>
      i.counts.health
        ? "Health sites on the scan create a natural adjacency."
        : i.counts.shop
          ? "Convenience mix is present; a window format beats a full drugstore."
          : "Only if the barangay has no easy pharmacy walk.",
  },
  {
    idea: "Print / photocopy hub",
    why: (i) =>
      i.counts.school || i.counts.finance
        ? "Students and office errands stack on the same hours."
        : "Thin unless a school or hall of justice is in range.",
  },
  {
    idea: "Milk-tea / dessert kiosk",
    why: (i) =>
      i.counts.food >= 6
        ? "Food cluster is busy — a kiosk rides existing footfall with lower rent."
        : "Needs a pass-by crowd; do not build a full cafe if the count is thin.",
  },
];

function verdictOf(score: number, competition: number): FsVerdict {
  if (score >= 70 && competition < 80) return "go";
  if (score < 40 || competition >= 90) return "no-go";
  return "caution";
}

function similar(a: string, b: string) {
  const na = a.toLowerCase();
  const nb = b.toLowerCase();
  if (na.includes(nb) || nb.includes(na)) return true;
  const keys = ["coffee", "cafe", "bakery", "sari", "car wash", "lodging", "laundry", "tutorial", "pharmacy", "print", "milk"];
  return keys.some((k) => na.includes(k) && nb.includes(k));
}

export function rankAlternatives(intel: LocationIntel, currentIdea: string): AlternativeIdea[] {
  const rows = CATALOG.filter((c) => !similar(c.idea, currentIdea)).map((c) => {
    const scores = scoreSite(intel, c.idea);
    return {
      idea: c.idea,
      score: scores.overall,
      verdict: verdictOf(scores.overall, scores.competition),
      why: c.why(intel),
      rank: 0,
    };
  });
  rows.sort((a, b) => b.score - a.score);
  return rows.slice(0, 6).map((r, i) => ({ ...r, rank: i + 1 }));
}
