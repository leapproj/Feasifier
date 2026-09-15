import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { rankAlternatives } from "@/lib/alternatives";
import { synthesizeStudy } from "@/lib/ai/synthesize";
import type { FsReport, LocationIntel, SiteScores } from "@/lib/types";

const ReportSchema = z.object({
  title: z.string(),
  verdict: z.enum(["go", "caution", "no-go"]),
  feasibilityScore: z.number(),
  summary: z.string(),
  location: z.object({
    score: z.number(),
    footTraffic: z.string(),
    demographics: z.string(),
    access: z.string(),
  }),
  market: z.object({
    demand: z.string(),
    competition: z.string(),
    positioning: z.string(),
  }),
  financials: z.object({
    startupCostPhp: z.number(),
    monthlyRevenuePhp: z.number(),
    monthlyOpexPhp: z.number(),
    breakEvenMonths: z.number(),
    year3RoiPct: z.number(),
    notes: z.string(),
  }),
  technical: z.string().optional(),
  management: z.string().optional(),
  socioeconomic: z.string().optional(),
  alternatives: z
    .array(
      z.object({
        rank: z.number(),
        idea: z.string(),
        score: z.number(),
        verdict: z.enum(["go", "caution", "no-go"]),
        why: z.string(),
      }),
    )
    .optional(),
  risks: z.array(
    z.object({
      level: z.enum(["low", "medium", "high"]),
      title: z.string(),
      detail: z.string(),
    }),
  ),
  permits: z.array(z.object({ name: z.string(), note: z.string() })),
  recommendations: z.array(z.string()),
  researchLog: z.array(z.object({ step: z.string(), finding: z.string() })),
});

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fence ? fence[1] : trimmed;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end < 0) throw new Error("Model did not return JSON");
  return JSON.parse(raw.slice(start, end + 1));
}

function poiDigest(intel: LocationIntel) {
  const top = intel.pois.slice(0, 24).map((p) => `${p.kind}:${p.name}`);
  return {
    counts: intel.counts,
    sample: top,
    totalPois: intel.pois.length,
  };
}

async function readApiKey() {
  const proc = await import("node:process");
  return proc.env["XAI_API_KEY"]?.trim() || "";
}

let agentQuotaBlocked = false;

async function askAgent(
  apiKey: string,
  idea: string,
  deep: boolean,
  intel: LocationIntel,
  scores: SiteScores,
): Promise<FsReport | null> {
  const system = `You are Feasify's trained research-and-development agent for Philippine MSMEs.
You write grounded feasibility studies for first-time founders (students, parents, career-switchers).
Use ONLY the supplied location intelligence for local facts. Do not invent POI counts.
Financials are directional estimates in Philippine pesos for a small first outlet — conservative, not hype.
Permits must match PH practice: DTI business name, Barangay clearance, Mayor's/business permit, BIR (2303), sanitary, fire safety as relevant.
Return a single JSON object that matches the schema. No markdown.
Tone: plain, specific, editorial. No emoji. No exclamation.`;

  const user = JSON.stringify({
    mode: deep ? "deep-research" : "standard",
    businessIdea: idea,
    place: {
      displayName: intel.displayName,
      city: intel.city,
      neighbourhood: intel.neighbourhood,
      country: intel.country,
      lat: intel.lat,
      lng: intel.lng,
    },
    siteScores: scores,
    openStreetMap: poiDigest(intel),
    instructions: {
      feasibilityScore: "0-100, consistent with siteScores.overall and competition.",
      verdict: "go if overall>=70 and competition<80; no-go if overall<40 or competition>=90; else caution.",
      researchLog: "Show the agent's reasoning as 4-8 steps.",
      alternatives: "Rank 4-6 alternative businesses for THIS pin, different from the user's idea, with score 0-100 and a one-line why.",
      deep: deep
        ? "Include sensitivity (what if traffic -20%), sharper competitor positioning, and a 3-year ROI view."
        : "Keep sections tight; still complete.",
    },
  });

  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-4.5",
      temperature: 0.35,
      max_tokens: deep ? 2800 : 1600,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
    signal: AbortSignal.timeout(40000),
  });

  if (res.status === 403) {
    agentQuotaBlocked = true;
    return null;
  }
  if (!res.ok) return null;

  const body = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = body.choices?.[0]?.message?.content ?? "";
  const parsed = ReportSchema.safeParse(extractJson(text));
  if (!parsed.success) return null;
  const report = parsed.data as FsReport;
  report.feasibilityScore = Math.max(0, Math.min(100, Math.round(report.feasibilityScore)));
  return report;
}

export const generateFeasibilityStudy = createServerFn({ method: "POST" })
  .validator(
    (input: {
      idea: string;
      deep: boolean;
      intel: LocationIntel;
      scores: SiteScores;
    }) => input,
  )
  .handler(
    async ({
      data,
    }): Promise<{ ok: true; report: FsReport } | { ok: false; error: string }> => {
      const idea = data.idea.trim();
      if (idea.length < 3) {
        return { ok: false, error: "Describe the business you want to open." };
      }

      const siteModel = synthesizeStudy(idea, data.intel, data.scores, data.deep);
      const alternatives = rankAlternatives(data.intel, idea);

      const apiKey = await readApiKey();
      if (apiKey && !agentQuotaBlocked) {
        try {
          const agent = await askAgent(apiKey, idea, data.deep, data.intel, data.scores);
          if (agent) {
            return {
              ok: true,
              report: {
                ...siteModel,
                ...agent,
                alternatives: alternatives,
                technical: agent.technical || siteModel.technical,
                management: agent.management || siteModel.management,
                socioeconomic: agent.socioeconomic || siteModel.socioeconomic,
              },
            };
          }
        } catch {
          /* fall through to the live site model */
        }
      }

      return { ok: true, report: { ...siteModel, alternatives } };
    },
  );
