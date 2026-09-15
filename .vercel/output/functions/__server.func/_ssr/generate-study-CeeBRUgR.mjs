import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { t as rankAlternatives } from "./alternatives-BjZF5tAv.mjs";
import { a as object, i as number, n as array, o as string, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/generate-study-CeeBRUgR.js
function place(intel) {
	return intel.neighbourhood || intel.city || "this pin";
}
function names(pois, kind, n = 3) {
	return pois.filter((p) => p.kind === kind && p.name).slice(0, n).map((p) => p.name);
}
function list(items, empty) {
	if (!items.length) return empty;
	if (items.length === 1) return items[0];
	return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}
function ideaKind(idea) {
	const s = idea.toLowerCase();
	if (/resto|restaurant|cafe|coffee|kape|bakery|food|carinderia|fast.?food|grill|bar/.test(s)) return "food";
	if (/sari-?sari|store|retail|minimart|grocery|water.?refill/.test(s)) return "retail";
	if (/car.?wash|auto|garage/.test(s)) return "auto";
	if (/hotel|inn|lodging|hostel|boarding/.test(s)) return "lodging";
	return "general";
}
function money(kind, scores, deep) {
	const traffic = scores.footTraffic / 100;
	const demand = scores.demand / 100;
	const base = {
		food: {
			start: 165e4,
			rev: 32e4,
			opex: 21e4
		},
		retail: {
			start: 28e4,
			rev: 95e3,
			opex: 55e3
		},
		auto: {
			start: 92e4,
			rev: 175e3,
			opex: 11e4
		},
		lodging: {
			start: 34e5,
			rev: 42e4,
			opex: 28e4
		},
		general: {
			start: 78e4,
			rev: 16e4,
			opex: 105e3
		}
	}[kind];
	const lift = .7 + traffic * .45 + demand * .2;
	const start = Math.round(base.start * (deep ? 1.08 : 1));
	const rev = Math.round(base.rev * lift);
	const opex = Math.round(base.opex * (.85 + traffic * .25));
	const monthlyProfit = rev - opex;
	const breakEvenMonths = monthlyProfit > 0 ? Math.max(4, Math.round(start / monthlyProfit)) : 24;
	const year3 = monthlyProfit * 36 - start;
	return {
		start,
		rev,
		opex,
		breakEvenMonths,
		year3RoiPct: Math.round(year3 / start * 100)
	};
}
function synthesizeStudy(idea, intel, scores, deep) {
	const where = place(intel);
	const city = intel.city || "the city";
	const kind = ideaKind(idea);
	const food = names(intel.pois, "food");
	const schools = names(intel.pois, "school");
	const transit = names(intel.pois, "transit");
	const shops = names(intel.pois, "shop");
	const { start, rev, opex, breakEvenMonths, year3RoiPct } = money(kind, scores, deep);
	const alternatives = rankAlternatives(intel, idea);
	let verdict = "caution";
	if (scores.overall >= 70 && scores.competition < 80) verdict = "go";
	else if (scores.overall < 40 || scores.competition >= 90) verdict = "no-go";
	const rivals = kind === "food" ? `${intel.counts.food} food-and-drink spots within ~850m${food.length ? ` (including ${list(food, "")})` : ""}` : kind === "retail" ? `${intel.counts.shop} shops nearby${shops.length ? ` (${list(shops, "")})` : ""}` : `${intel.pois.length} mapped places on this block`;
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
			demographics: schools.length ? `Schools on the scan include ${list(schools, "none")}. Student and family traffic is a real demand lever for ${city}.` : `Few schools mapped in this radius. Daytime demand will lean on residents, offices, and passers-by rather than campus surge.`,
			access: `Access score ${scores.access}. ${intel.counts.finance} banks/ATMs and ${intel.counts.transit} transit nodes. ${intel.displayName}`
		},
		market: {
			demand: `Demand score ${scores.demand} from ${intel.counts.school} schools, ${intel.counts.health} health sites, and ${intel.counts.shop} shops. ${kind === "food" ? "Study-nook or all-day menus fit if students and remote workers already pass here." : "Match hours to when this block is actually busy — mornings for transit, evenings for residents."}`,
			competition: rivals + `. Competition score ${scores.competition} (higher is more crowded).`,
			positioning: kind === "food" ? "Win on seating, hours, and a single signature drink or bake — especially if nearby cafes are takeout-heavy." : kind === "retail" ? "Bundle (sari-sari + water, or load + photocopy) so you are not a pure price war against older stores." : "Pick a service the mapped mix does not already cover well, and keep the first outlet small."
		},
		technical: kind === "food" ? "Need 40–80 sqm with a grease-trap-ready wet area, exhaust, and 30–40 seats if study-nooks are the offer. Power at 60A+. Delivery window at the back if the street is one-way." : kind === "retail" ? "15–30 sqm street frontage, security grille, and a water line if you add refilling. Storage should equal the selling floor." : kind === "auto" ? "Open lot with drainage, oil interceptor, and a holding lane that does not block the road. City engineering will ask." : "Confirm occupancy type with the city building official before fit-out. Do not buy equipment until the permit path is timed.",
		management: "Owner-operator for the first 6 months. One full-time staff plus a closer. Simple POS, daily cash count, and a weekly supplier run. No professional manager until month 8 of hitting the revenue line.",
		socioeconomic: `A micro outlet at ${where} keeps spend inside the barangay and can hire locally. Risk is displacement of an older sari-sari if you compete only on price. Prefer a complementary offer.`,
		financials: {
			startupCostPhp: start,
			monthlyRevenuePhp: rev,
			monthlyOpexPhp: opex,
			breakEvenMonths,
			year3RoiPct,
			notes: deep ? `Deep pass: if foot traffic runs 20% lighter than the proxy, monthly revenue lands near ₱${Math.round(rev * .8).toLocaleString("en-PH")} and break-even stretches. Rent, fit-out, and 2 months working capital dominate startup. These are directional MSME ranges, not a bank model.` : "Directional first-outlet ranges in PHP. Rent and fit-out will swing the most. Validate with three landlord quotes before treating break-even as a plan."
		},
		alternatives,
		risks: [
			{
				level: scores.competition >= 70 ? "high" : "medium",
				title: "Clustered competition",
				detail: rivals + "."
			},
			{
				level: intel.counts.transit < 2 ? "high" : "low",
				title: "Walk-up dependence",
				detail: intel.counts.transit < 2 ? "Few transit nodes mapped. You will need parking, delivery, or a destination reason to visit." : "Transit on the scan can feed walk-ins, but peak hours still need a count on two weekdays and a Saturday."
			},
			{
				level: "medium",
				title: "Permit and fit-out slip",
				detail: "Mayor’s permit, BIR, and sanitary timing in PH cities often eat 4–8 weeks. Build that into cash."
			},
			...deep ? [{
				level: "medium",
				title: "Proxy data, not cameras",
				detail: "Map coverage is incomplete in some barangays. A quiet street with few mapped nodes can still be busy — and a mapped corridor can be dead at night."
			}] : []
		],
		permits: [
			{
				name: "DTI business name",
				note: "Online, usually a few days. Required before the rest of the stack."
			},
			{
				name: "Barangay clearance",
				note: `Get this from the barangay covering ${where}.`
			},
			{
				name: "Mayor’s / business permit",
				note: `City hall of ${city}. Zoning and locational clearance may be asked.`
			},
			{
				name: "BIR 2303",
				note: "TIN, official receipts, and books. Do this before the first sale."
			},
			{
				name: "Sanitary permit",
				note: kind === "food" ? "Non-negotiable for F&B. City health office." : "Needed if you handle food or water; still often requested at inspection."
			},
			{
				name: "BFP fire safety",
				note: "Inspection tied to the occupancy. Budget extinguishers and layout."
			}
		],
		recommendations: [
			"Stand on the pin at 7:30am, 12:00nn, and 6:00pm on a weekday and a Saturday; count people for 20 minutes each.",
			"Ask three nearby operators what they pay in rent per sqm — do not use listing prices alone.",
			topAlt ? `Compare this idea against ${topAlt.idea} (rank 1 alternative, ${topAlt.score}/100) before you sign.` : "Walk 400m in each direction and note what is missing from the mapped mix.",
			"Hold 2 months of opex in cash before opening; permit slip is the usual killer.",
			...deep ? ["Run a weekend pop-up or delivery-only week from a nearby kitchen before committing to fit-out.", "Model rent at +15% and traffic at −20%; if both still break even under 14 months, the site is robust."] : []
		],
		researchLog: [
			{
				step: "Location scout",
				finding: `Reverse-geocoded ${intel.lat.toFixed(5)}, ${intel.lng.toFixed(5)} → ${intel.displayName}.`
			},
			{
				step: "Amenity scan",
				finding: `${intel.pois.length} nodes in 850m — food ${intel.counts.food}, shops ${intel.counts.shop}, schools ${intel.counts.school}, transit ${intel.counts.transit}.`
			},
			{
				step: "Foot-traffic proxy",
				finding: `Score ${scores.footTraffic} from transit, schools, and shop density. Not a mobile-SDK count.`
			},
			{
				step: "Competition",
				finding: rivals + "."
			},
			{
				step: "Alternative ranking",
				finding: alternatives.map((a) => `#${a.rank} ${a.idea} (${a.score})`).join("; ")
			},
			{
				step: "Regulation",
				finding: "PH MSME stack: DTI, barangay, mayor’s permit, BIR, sanitary, fire."
			}
		]
	};
}
var ReportSchema = object({
	title: string(),
	verdict: _enum([
		"go",
		"caution",
		"no-go"
	]),
	feasibilityScore: number(),
	summary: string(),
	location: object({
		score: number(),
		footTraffic: string(),
		demographics: string(),
		access: string()
	}),
	market: object({
		demand: string(),
		competition: string(),
		positioning: string()
	}),
	financials: object({
		startupCostPhp: number(),
		monthlyRevenuePhp: number(),
		monthlyOpexPhp: number(),
		breakEvenMonths: number(),
		year3RoiPct: number(),
		notes: string()
	}),
	technical: string().optional(),
	management: string().optional(),
	socioeconomic: string().optional(),
	alternatives: array(object({
		rank: number(),
		idea: string(),
		score: number(),
		verdict: _enum([
			"go",
			"caution",
			"no-go"
		]),
		why: string()
	})).optional(),
	risks: array(object({
		level: _enum([
			"low",
			"medium",
			"high"
		]),
		title: string(),
		detail: string()
	})),
	permits: array(object({
		name: string(),
		note: string()
	})),
	recommendations: array(string()),
	researchLog: array(object({
		step: string(),
		finding: string()
	}))
});
function extractJson(text) {
	const trimmed = text.trim();
	const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
	const raw = fence ? fence[1] : trimmed;
	const start = raw.indexOf("{");
	const end = raw.lastIndexOf("}");
	if (start < 0 || end < 0) throw new Error("Model did not return JSON");
	return JSON.parse(raw.slice(start, end + 1));
}
function poiDigest(intel) {
	const top = intel.pois.slice(0, 24).map((p) => `${p.kind}:${p.name}`);
	return {
		counts: intel.counts,
		sample: top,
		totalPois: intel.pois.length
	};
}
async function readApiKey() {
	return (await import("node:process")).env["XAI_API_KEY"]?.trim() || "";
}
var agentQuotaBlocked = false;
async function askAgent(apiKey, idea, deep, intel, scores) {
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
			lng: intel.lng
		},
		siteScores: scores,
		openStreetMap: poiDigest(intel),
		instructions: {
			feasibilityScore: "0-100, consistent with siteScores.overall and competition.",
			verdict: "go if overall>=70 and competition<80; no-go if overall<40 or competition>=90; else caution.",
			researchLog: "Show the agent's reasoning as 4-8 steps.",
			alternatives: "Rank 4-6 alternative businesses for THIS pin, different from the user's idea, with score 0-100 and a one-line why.",
			deep: deep ? "Include sensitivity (what if traffic -20%), sharper competitor positioning, and a 3-year ROI view." : "Keep sections tight; still complete."
		}
	});
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			temperature: .35,
			max_tokens: deep ? 2800 : 1600,
			response_format: { type: "json_object" },
			messages: [{
				role: "system",
				content: system
			}, {
				role: "user",
				content: user
			}]
		}),
		signal: AbortSignal.timeout(4e4)
	});
	if (res.status === 403) {
		agentQuotaBlocked = true;
		return null;
	}
	if (!res.ok) return null;
	const text = (await res.json()).choices?.[0]?.message?.content ?? "";
	const parsed = ReportSchema.safeParse(extractJson(text));
	if (!parsed.success) return null;
	const report = parsed.data;
	report.feasibilityScore = Math.max(0, Math.min(100, Math.round(report.feasibilityScore)));
	return report;
}
var generateFeasibilityStudy_createServerFn_handler = createServerRpc({
	id: "84c04695162596c46ea9c6ecd9cba7dd5d05f049f3f45cceb823e5f371826118",
	name: "generateFeasibilityStudy",
	filename: "src/lib/ai/generate-study.ts"
}, (opts) => generateFeasibilityStudy.__executeServer(opts));
var generateFeasibilityStudy = createServerFn({ method: "POST" }).validator((input) => input).handler(generateFeasibilityStudy_createServerFn_handler, async ({ data }) => {
	const idea = data.idea.trim();
	if (idea.length < 3) return {
		ok: false,
		error: "Describe the business you want to open."
	};
	const siteModel = synthesizeStudy(idea, data.intel, data.scores, data.deep);
	const alternatives = rankAlternatives(data.intel, idea);
	const apiKey = await readApiKey();
	if (apiKey && !agentQuotaBlocked) try {
		const agent = await askAgent(apiKey, idea, data.deep, data.intel, data.scores);
		if (agent) return {
			ok: true,
			report: {
				...siteModel,
				...agent,
				alternatives,
				technical: agent.technical || siteModel.technical,
				management: agent.management || siteModel.management,
				socioeconomic: agent.socioeconomic || siteModel.socioeconomic
			}
		};
	} catch {}
	return {
		ok: true,
		report: {
			...siteModel,
			alternatives
		}
	};
});
//#endregion
export { generateFeasibilityStudy_createServerFn_handler };
