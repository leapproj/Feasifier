//#region node_modules/.nitro/vite/services/ssr/assets/scoring-CEHx3IFp.js
var FOOD_RE = /resto|restaurant|cafe|coffee|kape|bakery|panaderia|food|carinderia|fast.?food|grill|bar|milk.?tea|dessert/i;
var WASH_RE = /car.?wash|auto|garage|repair/i;
var RETAIL_RE = /sari-?sari|store|retail|minimart|grocery|water.?refill/i;
var LODGING_RE = /hotel|inn|lodging|hostel|apartment|boarding/i;
function clamp(n, min = 0, max = 100) {
	return Math.max(min, Math.min(max, Math.round(n)));
}
function classifyTag(amenity, shop, highway) {
	const a = (amenity ?? "").toLowerCase();
	const s = (shop ?? "").toLowerCase();
	const h = (highway ?? "").toLowerCase();
	if ([
		"restaurant",
		"cafe",
		"fast_food",
		"bar",
		"food_court",
		"ice_cream"
	].includes(a) || s === "bakery") return {
		kind: "food",
		tag: a || s
	};
	if ([
		"school",
		"university",
		"college",
		"kindergarten"
	].includes(a)) return {
		kind: "school",
		tag: a
	};
	if ([
		"hospital",
		"clinic",
		"doctors",
		"pharmacy",
		"dentist"
	].includes(a) || s === "chemist") return {
		kind: "health",
		tag: a || s
	};
	if (h === "bus_stop" || a === "bus_station" || a === "taxi") return {
		kind: "transit",
		tag: h || a
	};
	if (["bank", "atm"].includes(a) || s === "money_lender") return {
		kind: "finance",
		tag: a || s
	};
	if (s || a === "marketplace") return {
		kind: "shop",
		tag: s || a
	};
	return {
		kind: "other",
		tag: a || s || h || "poi"
	};
}
function emptyCounts() {
	return {
		food: 0,
		shop: 0,
		school: 0,
		health: 0,
		transit: 0,
		finance: 0,
		other: 0
	};
}
function tally(pois) {
	const c = emptyCounts();
	for (const p of pois) c[p.kind] += 1;
	return c;
}
function scoreSite(intel, idea) {
	const { counts, pois } = intel;
	const total = pois.length;
	const density = Math.min(total / 40, 1);
	const footTraffic = clamp(18 + counts.transit * 8 + counts.school * 6 + counts.shop * 2.2 + counts.food * 1.4 + counts.finance * 3);
	let competitionRaw = counts.food * 6 + counts.shop * 2;
	if (FOOD_RE.test(idea)) competitionRaw = counts.food * 11 + counts.shop * 1.5;
	else if (RETAIL_RE.test(idea)) competitionRaw = counts.shop * 8 + counts.food * 2;
	else if (WASH_RE.test(idea)) competitionRaw = 25 + counts.shop * 1.5;
	else if (LODGING_RE.test(idea)) competitionRaw = 20 + counts.food * 2;
	const competition = clamp(competitionRaw);
	const access = clamp(20 + counts.transit * 14 + counts.finance * 4 + density * 20);
	const demand = clamp(16 + counts.school * 10 + counts.shop * 3 + counts.health * 5 + counts.food * 2 + density * 18);
	return {
		footTraffic,
		competition,
		access,
		demand,
		overall: clamp(footTraffic * .28 + demand * .27 + access * .2 + (100 - competition) * .25)
	};
}
function scoreLabel(n) {
	if (n >= 75) return "Strong";
	if (n >= 55) return "Viable";
	if (n >= 40) return "Mixed";
	return "Thin";
}
function kindLabel(kind) {
	switch (kind) {
		case "food": return "Food & drink";
		case "shop": return "Retail";
		case "school": return "Schools";
		case "health": return "Health";
		case "transit": return "Transit";
		case "finance": return "Banks / ATM";
		default: return "Other";
	}
}
//#endregion
export { scoreSite as a, scoreLabel as i, emptyCounts as n, tally as o, kindLabel as r, classifyTag as t };
