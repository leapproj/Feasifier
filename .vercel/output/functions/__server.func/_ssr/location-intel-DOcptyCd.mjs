import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { n as emptyCounts, o as tally, t as classifyTag } from "./scoring-CEHx3IFp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/location-intel-DOcptyCd.js
var UA = "Feasify/1.0 (map-based MSME feasibility research)";
async function reverseGeocode(lat, lng) {
	const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=18&addressdetails=1`;
	const res = await fetch(url, {
		headers: {
			"User-Agent": UA,
			Accept: "application/json"
		},
		signal: AbortSignal.timeout(1e4)
	});
	if (!res.ok) return null;
	return await res.json();
}
async function overpassPois(lat, lng) {
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
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
		},
		body: `data=${encodeURIComponent(q)}`,
		signal: AbortSignal.timeout(18e3)
	});
	if (!res.ok) return [];
	const body = await res.json();
	const pois = [];
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
			tag
		});
		if (pois.length >= 120) break;
	}
	return pois;
}
var fetchLocationIntel_createServerFn_handler = createServerRpc({
	id: "638f6bb93bb6b4a9c56ebbed88d1f11fd81f89d1c7abcf71ec1e01741cf2de3a",
	name: "fetchLocationIntel",
	filename: "src/lib/geo/location-intel.ts"
}, (opts) => fetchLocationIntel.__executeServer(opts));
var fetchLocationIntel = createServerFn({ method: "POST" }).validator((input) => input).handler(fetchLocationIntel_createServerFn_handler, async ({ data }) => {
	const { lat, lng } = data;
	if (!Number.isFinite(lat) || !Number.isFinite(lng)) return {
		ok: false,
		error: "Invalid coordinates"
	};
	try {
		const [geo, pois] = await Promise.all([reverseGeocode(lat, lng).catch(() => null), overpassPois(lat, lng).catch(() => [])]);
		const addr = geo?.address ?? {};
		const city = addr.city ?? addr.town ?? addr.village ?? addr.municipality ?? addr.county ?? addr.state ?? "";
		const neighbourhood = addr.neighbourhood ?? addr.suburb ?? addr.quarter ?? "";
		return {
			ok: true,
			intel: {
				lat,
				lng,
				displayName: geo?.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
				city,
				neighbourhood,
				country: addr.country ?? "",
				pois,
				counts: pois.length ? tally(pois) : emptyCounts()
			}
		};
	} catch {
		return {
			ok: false,
			error: "Could not read this area. Try another pin."
		};
	}
});
var searchPlaces_createServerFn_handler = createServerRpc({
	id: "d7c40254e0ad028fcf807f0e541e7355bf66f50db8e59bb94015678be3e2c9cf",
	name: "searchPlaces",
	filename: "src/lib/geo/location-intel.ts"
}, (opts) => searchPlaces.__executeServer(opts));
var searchPlaces = createServerFn({ method: "POST" }).validator((input) => input).handler(searchPlaces_createServerFn_handler, async ({ data }) => {
	const q = data.q.trim();
	if (q.length < 2) return [];
	const url = `https://nominatim.openstreetmap.org/search?format=json&limit=6&addressdetails=0&q=${encodeURIComponent(q)}`;
	const res = await fetch(url, {
		headers: {
			"User-Agent": UA,
			Accept: "application/json"
		},
		signal: AbortSignal.timeout(8e3)
	});
	if (!res.ok) return [];
	return (await res.json()).map((r) => ({
		label: r.display_name,
		lat: Number(r.lat),
		lng: Number(r.lon)
	}));
});
//#endregion
export { fetchLocationIntel_createServerFn_handler, searchPlaces_createServerFn_handler };
