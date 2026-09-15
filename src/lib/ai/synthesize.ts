import { rankAlternatives } from "@/lib/alternatives";
import type { FsReport, FsVerdict, LocationIntel, Poi, SiteScores } from "@/lib/types";

function place(intel: LocationIntel) {
  return intel.neighbourhood || intel.city || "this pin";
}

function names(pois: Poi[], kind: Poi["kind"], n = 3) {
  return pois
    .filter((p) => p.kind === kind && p.name)
    .slice(0, n)
    .map((p) => p.name);
}

function list(items: string[], empty: string) {
  if (!items.length) return empty;
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function ideaKind(idea: string) {
  const s = idea.toLowerCase();
  if (/resto|restaurant|cafe|coffee|kape|bakery|food|carinderia|fast.?food|grill|bar/.test(s))
    return "food" as const;
  if (/sari-?sari|store|retail|minimart|grocery|water.?refill/.test(s)) return "retail" as const;
  if (/car.?wash|auto|garage/.test(s)) return "auto" as const;
  if (/hotel|inn|lodging|hostel|boarding/.test(s)) return "lodging" as const;
  return "general" as const;
}

function money(kind: ReturnType<typeof ideaKind>, scores: SiteScores, deep: boolean) {
  const traffic = scores.footTraffic / 100;
  const demand = scores.demand / 100;
  const base = {
    food: { start: 1_650_000, rev: 320_000, opex: 210_000 },
    retail: { start: 280_000, rev: 95_000, opex: 55_000 },
    auto: { start: 920_000, rev: 175_000, opex: 110_000 },
    lodging: { start: 3_400_000, rev: 420_000, opex: 280_000 },
    general: { start: 780_000, rev: 160_000, opex: 105_000 },
  }[kind];
  const lift = 0.7 + traffic * 0.45 + demand * 0.2;
  const start = Math.round(base.start * (deep ? 1.08 : 1));
  const rev = Math.round(base.rev * lift);
  const opex = Math.round(base.opex * (0.85 + traffic * 0.25));
  const monthlyProfit = rev - opex;
  const breakEvenMonths = monthlyProfit > 0 ? Math.max(4, Math.round(start / monthlyProfit)) : 24;
  const year3 = monthlyProfit * 36 - start;
  const year3RoiPct = Math.round((year3 / start) * 100);
  return { start, rev, opex, breakEvenMonths, year3RoiPct };
}

export function synthesizeStudy(
  idea: string,
  intel: LocationIntel,
  scores: SiteScores,
  deep: boolean,
): FsReport {
  const where = place(intel);
  const city = intel.city || "the city";
  const kind = ideaKind(idea);
  const food = names(intel.pois, "food");
  const schools = names(intel.pois, "school");
  const transit = names(intel.pois, "transit");
  const shops = names(intel.pois, "shop");
  const { start, rev, opex, breakEvenMonths, year3RoiPct } = money(kind, scores, deep);
  const alternatives = rankAlternatives(intel, idea);

  let verdict: FsVerdict = "caution";
  if (scores.overall >= 70 && scores.competition < 80) verdict = "go";
  else if (scores.overall < 40 || scores.competition >= 90) verdict = "no-go";

  const rivals =
    kind === "food"
      ? `${intel.counts.food} food-and-drink spots within ~850m${food.length ? ` (including ${list(food, "")})` : ""}`
      : kind === "retail"
        ? `${intel.counts.shop} shops nearby${shops.length ? ` (${list(shops, "")})` : ""}`
        : `${intel.pois.length} mapped places on this block`;

  const score = scores.overall;
  const topAlt = alternatives[0];

  return {
    title: `${idea} — ${where}`,
    verdict,
    feasibilityScore: score,
    summary: `A ${idea.toLowerCase()} at ${where} scores ${score}/100 on the live site model. Foot traffic is ${scores.footTraffic}, demand ${scores.demand}, access ${scores.access}, competition ${scores.competition}. ${intel.pois.length} mapped places were read in an 850-meter radius. ${verdict === "go" ? "The mix supports a small first outlet if you differentiate hard." : verdict === "no-go" ? "The block is a weak first site for this idea — see ranked alternatives before you walk away from the lot." : "Viable only with a tight concept, conservative build-out, and a 90-day traffic test."}${topAlt ? ` Strongest alternative on this pin: ${topAlt.idea} (${topAlt.score}/100).` : ""}`,
    location: {
      score: scores.overall,
      footTraffic: `Proxy score ${scores.footTraffic}. ${intel.counts.transit} transit stops and ${intel.counts.shop + intel.counts.food} shops/eateries sit on the block${transit.length ? `; nearest stops include ${list(transit, "none named")}` : ""}. This is pedestrian density inferred from mapped amenities, not a camera count.`,
      demographics: schools.length
        ? `Schools on the scan include ${list(schools, "none")}. Student and family traffic is a real demand lever for ${city}.`
        : `Few schools mapped in this radius. Daytime demand will lean on residents, offices, and passers-by rather than campus surge.`,
      access: `Access score ${scores.access}. ${intel.counts.finance} banks/ATMs and ${intel.counts.transit} transit nodes. ${intel.displayName}`,
    },
    market: {
      demand: `Demand score ${scores.demand} from ${intel.counts.school} schools, ${intel.counts.health} health sites, and ${intel.counts.shop} shops. ${kind === "food" ? "Study-nook or all-day menus fit if students and remote workers already pass here." : "Match hours to when this block is actually busy — mornings for transit, evenings for residents."}`,
      competition: rivals + `. Competition score ${scores.competition} (higher is more crowded).`,
      positioning:
        kind === "food"
          ? "Win on seating, hours, and a single signature drink or bake — especially if nearby cafes are takeout-heavy."
          : kind === "retail"
            ? "Bundle (sari-sari + water, or load + photocopy) so you are not a pure price war against older stores."
            : "Pick a service the mapped mix does not already cover well, and keep the first outlet small.",
    },
    technical:
      kind === "food"
        ? "Need 40–80 sqm with a grease-trap-ready wet area, exhaust, and 30–40 seats if study-nooks are the offer. Power at 60A+. Delivery window at the back if the street is one-way."
        : kind === "retail"
          ? "15–30 sqm street frontage, security grille, and a water line if you add refilling. Storage should equal the selling floor."
          : kind === "auto"
            ? "Open lot with drainage, oil interceptor, and a holding lane that does not block the road. City engineering will ask."
            : "Confirm occupancy type with the city building official before fit-out. Do not buy equipment until the permit path is timed.",
    management:
      "Owner-operator for the first 6 months. One full-time staff plus a closer. Simple POS, daily cash count, and a weekly supplier run. No professional manager until month 8 of hitting the revenue line.",
    socioeconomic: `A micro outlet at ${where} keeps spend inside the barangay and can hire locally. Risk is displacement of an older sari-sari if you compete only on price. Prefer a complementary offer.`,
    financials: {
      startupCostPhp: start,
      monthlyRevenuePhp: rev,
      monthlyOpexPhp: opex,
      breakEvenMonths,
      year3RoiPct,
      notes: deep
        ? `Deep pass: if foot traffic runs 20% lighter than the proxy, monthly revenue lands near ₱${Math.round(rev * 0.8).toLocaleString("en-PH")} and break-even stretches. Rent, fit-out, and 2 months working capital dominate startup. These are directional MSME ranges, not a bank model.`
        : "Directional first-outlet ranges in PHP. Rent and fit-out will swing the most. Validate with three landlord quotes before treating break-even as a plan.",
    },
    alternatives,
    risks: [
      {
        level: scores.competition >= 70 ? "high" : "medium",
        title: "Clustered competition",
        detail: rivals + ".",
      },
      {
        level: intel.counts.transit < 2 ? "high" : "low",
        title: "Walk-up dependence",
        detail:
          intel.counts.transit < 2
            ? "Few transit nodes mapped. You will need parking, delivery, or a destination reason to visit."
            : "Transit on the scan can feed walk-ins, but peak hours still need a count on two weekdays and a Saturday.",
      },
      {
        level: "medium",
        title: "Permit and fit-out slip",
        detail: "Mayor’s permit, BIR, and sanitary timing in PH cities often eat 4–8 weeks. Build that into cash.",
      },
      ...(deep
        ? [
            {
              level: "medium" as const,
              title: "Proxy data, not cameras",
              detail:
                "Map coverage is incomplete in some barangays. A quiet street with few mapped nodes can still be busy — and a mapped corridor can be dead at night.",
            },
          ]
        : []),
    ],
    permits: [
      { name: "DTI business name", note: "Online, usually a few days. Required before the rest of the stack." },
      { name: "Barangay clearance", note: `Get this from the barangay covering ${where}.` },
      { name: "Mayor’s / business permit", note: `City hall of ${city}. Zoning and locational clearance may be asked.` },
      { name: "BIR 2303", note: "TIN, official receipts, and books. Do this before the first sale." },
      { name: "Sanitary permit", note: kind === "food" ? "Non-negotiable for F&B. City health office." : "Needed if you handle food or water; still often requested at inspection." },
      { name: "BFP fire safety", note: "Inspection tied to the occupancy. Budget extinguishers and layout." },
    ],
    recommendations: [
      "Stand on the pin at 7:30am, 12:00nn, and 6:00pm on a weekday and a Saturday; count people for 20 minutes each.",
      "Ask three nearby operators what they pay in rent per sqm — do not use listing prices alone.",
      topAlt
        ? `Compare this idea against ${topAlt.idea} (rank 1 alternative, ${topAlt.score}/100) before you sign.`
        : "Walk 400m in each direction and note what is missing from the mapped mix.",
      "Hold 2 months of opex in cash before opening; permit slip is the usual killer.",
      ...(deep
        ? [
            "Run a weekend pop-up or delivery-only week from a nearby kitchen before committing to fit-out.",
            "Model rent at +15% and traffic at −20%; if both still break even under 14 months, the site is robust.",
          ]
        : []),
    ],
    researchLog: [
      {
        step: "Location scout",
        finding: `Reverse-geocoded ${intel.lat.toFixed(5)}, ${intel.lng.toFixed(5)} → ${intel.displayName}.`,
      },
      {
        step: "Amenity scan",
        finding: `${intel.pois.length} nodes in 850m — food ${intel.counts.food}, shops ${intel.counts.shop}, schools ${intel.counts.school}, transit ${intel.counts.transit}.`,
      },
      {
        step: "Foot-traffic proxy",
        finding: `Score ${scores.footTraffic} from transit, schools, and shop density. Not a mobile-SDK count.`,
      },
      {
        step: "Competition",
        finding: rivals + ".",
      },
      {
        step: "Alternative ranking",
        finding: alternatives
          .map((a) => `#${a.rank} ${a.idea} (${a.score})`)
          .join("; "),
      },
      {
        step: "Regulation",
        finding: "PH MSME stack: DTI, barangay, mayor’s permit, BIR, sanitary, fire.",
      },
    ],
  };
}
