export type PoiKind =
  | "food"
  | "shop"
  | "school"
  | "health"
  | "transit"
  | "finance"
  | "other";

export type Poi = {
  id: string;
  lat: number;
  lng: number;
  name: string;
  kind: PoiKind;
  tag: string;
};

export type LocationIntel = {
  lat: number;
  lng: number;
  displayName: string;
  city: string;
  neighbourhood: string;
  country: string;
  pois: Poi[];
  counts: Record<PoiKind, number>;
};

export type SiteScores = {
  footTraffic: number;
  competition: number;
  access: number;
  demand: number;
  overall: number;
};

export type FsVerdict = "go" | "caution" | "no-go";

export type AlternativeIdea = {
  rank: number;
  idea: string;
  score: number;
  verdict: FsVerdict;
  why: string;
};

export type FsReport = {
  title: string;
  verdict: FsVerdict;
  feasibilityScore: number;
  summary: string;
  location: {
    score: number;
    footTraffic: string;
    demographics: string;
    access: string;
  };
  market: {
    demand: string;
    competition: string;
    positioning: string;
  };
  technical: string;
  management: string;
  socioeconomic: string;
  financials: {
    startupCostPhp: number;
    monthlyRevenuePhp: number;
    monthlyOpexPhp: number;
    breakEvenMonths: number;
    year3RoiPct: number;
    notes: string;
  };
  alternatives: AlternativeIdea[];
  risks: { level: "low" | "medium" | "high"; title: string; detail: string }[];
  permits: { name: string; note: string }[];
  recommendations: string[];
  researchLog: { step: string; finding: string }[];
};

export type SavedStudy = {
  id: string;
  createdAt: number;
  businessIdea: string;
  deep: boolean;
  intel: LocationIntel;
  scores: SiteScores;
  report: FsReport;
};
