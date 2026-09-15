import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as scoreSite, i as scoreLabel, r as kindLabel } from "./scoring-CEHx3IFp.mjs";
import { t as rankAlternatives } from "./alternatives-BjZF5tAv.mjs";
import { a as Printer, c as MapPin, d as ChartColumn, i as Search, l as LoaderCircle, o as Plus, r as Trash2, s as Menu, t as X, u as FileSearch } from "../_libs/lucide-react.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { a as ResponsiveContainer, i as Bar, n as YAxis, o as Tooltip, r as XAxis, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BN9LVr8f.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HeatLegend({ layer, onLayer }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-auto absolute bottom-44 left-3 z-20 rounded-xl bg-surface/90 px-3 py-2 shadow-border md:bottom-40",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex gap-1 rounded-lg bg-surface-2 p-0.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `rounded-md px-2 py-1 text-xs ${layer === "roadmap" ? "bg-accent text-accent-fg" : "text-muted"}`,
					onClick: () => onLayer("roadmap"),
					children: "Map"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `rounded-md px-2 py-1 text-xs ${layer === "satellite" ? "bg-accent text-accent-fg" : "text-muted"}`,
					onClick: () => onLayer("satellite"),
					children: "Satellite"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-1.5 text-[10px] uppercase tracking-widest text-subtle",
				children: "Heat mix"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-1",
				children: [
					{
						label: "Food & drink",
						color: "bg-nogo"
					},
					{
						label: "Schools / demand",
						color: "bg-go"
					},
					{
						label: "Transit",
						color: "bg-accent"
					},
					{
						label: "Retail",
						color: "bg-muted"
					}
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-2 text-xs text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-2 rounded-full ${i.color}` }), i.label]
				}, i.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-[10px] text-subtle",
				children: "Google Map"
			})
		]
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var fetchLocationIntel = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("638f6bb93bb6b4a9c56ebbed88d1f11fd81f89d1c7abcf71ec1e01741cf2de3a"));
var searchPlaces = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("d7c40254e0ad028fcf807f0e541e7355bf66f50db8e59bb94015678be3e2c9cf"));
var useStudio = create()(persist((set, get) => ({
	idea: "",
	deep: false,
	pin: null,
	intel: null,
	scores: null,
	report: null,
	studies: [],
	activeId: null,
	generating: false,
	intelLoading: false,
	error: null,
	sidebarOpen: false,
	setIdea: (idea) => set({ idea }),
	setDeep: (deep) => set({ deep }),
	setPin: (pin) => set({
		pin,
		report: null,
		error: null,
		activeId: null
	}),
	setIntel: (intel, scores) => set({
		intel,
		scores,
		intelLoading: false
	}),
	setScores: (scores) => set({ scores }),
	setIntelLoading: (intelLoading) => set({ intelLoading }),
	setGenerating: (generating) => set({ generating }),
	setError: (error) => set({
		error,
		generating: false
	}),
	setReport: (report) => set({
		report,
		generating: false,
		error: null
	}),
	saveStudy: (study) => set({
		studies: [study, ...get().studies.filter((s) => s.id !== study.id)].slice(0, 24),
		activeId: study.id
	}),
	loadStudy: (id) => {
		const study = get().studies.find((s) => s.id === id);
		if (!study) return;
		set({
			activeId: id,
			idea: study.businessIdea,
			deep: study.deep,
			pin: {
				lat: study.intel.lat,
				lng: study.intel.lng
			},
			intel: study.intel,
			scores: study.scores,
			report: study.report,
			error: null
		});
	},
	deleteStudy: (id) => set({
		studies: get().studies.filter((s) => s.id !== id),
		activeId: get().activeId === id ? null : get().activeId
	}),
	newStudy: () => set({
		idea: "",
		pin: null,
		intel: null,
		scores: null,
		report: null,
		activeId: null,
		error: null,
		generating: false
	}),
	setSidebarOpen: (sidebarOpen) => set({ sidebarOpen })
}), {
	name: "feasify-studio",
	partialize: (s) => ({
		studies: s.studies,
		deep: s.deep
	})
}));
var CDO = [8.4542, 124.6319];
var KIND_COLOR = {
	food: "#c17b6a",
	shop: "#8e8c84",
	school: "#8fad8c",
	health: "#8fad8c",
	transit: "#1a73e8",
	finance: "#c4a574",
	other: "#6b6a64"
};
function googleUrl(layer) {
	return `https://{s}.google.com/vt/lyrs=${layer === "satellite" ? "y" : "m"}&hl=en&x={x}&y={y}&z={z}`;
}
function MapCanvas({ layer }) {
	const hostRef = (0, import_react.useRef)(null);
	const mapRef = (0, import_react.useRef)(null);
	const tilesRef = (0, import_react.useRef)(null);
	const markerRef = (0, import_react.useRef)(null);
	const heatRef = (0, import_react.useRef)([]);
	const [mapReady, setMapReady] = (0, import_react.useState)(false);
	const pin = useStudio((s) => s.pin);
	const intel = useStudio((s) => s.intel);
	const idea = useStudio((s) => s.idea);
	const setPin = useStudio((s) => s.setPin);
	const setIntel = useStudio((s) => s.setIntel);
	const setScores = useStudio((s) => s.setScores);
	const setIntelLoading = useStudio((s) => s.setIntelLoading);
	const setError = useStudio((s) => s.setError);
	(0, import_react.useEffect)(() => {
		if (!hostRef.current || mapRef.current) return;
		let cancelled = false;
		(async () => {
			const L = await import("../_libs/leaflet.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
			if (cancelled || !hostRef.current) return;
			const map = L.map(hostRef.current, {
				zoomControl: false,
				attributionControl: true
			}).setView(CDO, 15);
			const tiles = L.tileLayer(googleUrl("roadmap"), {
				maxZoom: 21,
				subdomains: [
					"mt0",
					"mt1",
					"mt2",
					"mt3"
				],
				attribution: "Map data &copy; Google"
			}).addTo(map);
			L.control.zoom({ position: "bottomright" }).addTo(map);
			map.on("click", (e) => {
				setPin({
					lat: e.latlng.lat,
					lng: e.latlng.lng
				});
			});
			tilesRef.current = tiles;
			mapRef.current = map;
			setMapReady(true);
		})();
		return () => {
			cancelled = true;
			mapRef.current?.remove();
			mapRef.current = null;
			tilesRef.current = null;
		};
	}, [setPin]);
	(0, import_react.useEffect)(() => {
		const map = mapRef.current;
		if (!mapReady || !map) return;
		let cancelled = false;
		(async () => {
			const L = await import("../_libs/leaflet.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
			if (cancelled) return;
			if (tilesRef.current) tilesRef.current.remove();
			const tiles = L.tileLayer(googleUrl(layer), {
				maxZoom: 21,
				subdomains: [
					"mt0",
					"mt1",
					"mt2",
					"mt3"
				],
				attribution: "Map data &copy; Google"
			}).addTo(map);
			tilesRef.current = tiles;
		})();
		return () => {
			cancelled = true;
		};
	}, [layer, mapReady]);
	(0, import_react.useEffect)(() => {
		const map = mapRef.current;
		if (!mapReady || !map) return;
		let alive = true;
		(async () => {
			const L = await import("../_libs/leaflet.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
			if (markerRef.current) {
				markerRef.current.remove();
				markerRef.current = null;
			}
			if (!pin) return;
			const icon = L.divIcon({
				className: "feasify-divicon",
				html: `<span class="feasify-pin block"></span>`,
				iconSize: [18, 18],
				iconAnchor: [9, 9]
			});
			const marker = L.marker([pin.lat, pin.lng], {
				icon,
				draggable: true
			}).addTo(map);
			marker.on("dragend", () => {
				const p = marker.getLatLng();
				setPin({
					lat: p.lat,
					lng: p.lng
				});
			});
			markerRef.current = marker;
			map.panTo([pin.lat, pin.lng], { animate: true });
			setIntelLoading(true);
			const result = await fetchLocationIntel({ data: {
				lat: pin.lat,
				lng: pin.lng
			} });
			if (!alive) return;
			if (!result.ok) {
				setIntelLoading(false);
				setError(result.error);
				return;
			}
			const scores = scoreSite(result.intel, useStudio.getState().idea);
			setIntel(result.intel, scores);
		})();
		return () => {
			alive = false;
		};
	}, [
		pin,
		mapReady,
		setError,
		setIntel,
		setIntelLoading,
		setPin
	]);
	(0, import_react.useEffect)(() => {
		const map = mapRef.current;
		if (!mapReady || !map) return;
		let cancelled = false;
		(async () => {
			const L = await import("../_libs/leaflet.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
			if (cancelled) return;
			for (const c of heatRef.current) c.remove();
			heatRef.current = [];
			if (!intel) return;
			heatRef.current = intel.pois.map((p) => L.circleMarker([p.lat, p.lng], {
				radius: p.kind === "transit" ? 7 : 5,
				color: KIND_COLOR[p.kind],
				weight: 0,
				fillOpacity: .55
			}).bindTooltip(`${p.name} · ${p.kind}`, { opacity: .92 }).addTo(map));
		})();
		return () => {
			cancelled = true;
		};
	}, [intel, mapReady]);
	(0, import_react.useEffect)(() => {
		const intelNow = useStudio.getState().intel;
		if (!intelNow) return;
		setScores(scoreSite(intelNow, idea));
	}, [idea, setScores]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: hostRef,
		className: "absolute inset-0 z-0"
	});
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function php(amount) {
	return new Intl.NumberFormat("en-PH", {
		style: "currency",
		currency: "PHP",
		maximumFractionDigits: 0
	}).format(amount);
}
function uid() {
	return crypto.randomUUID();
}
var VERDICT$1 = {
	go: "FEASIBLE",
	caution: "PROCEED WITH CARE",
	"no-go": "WEAK SITE"
};
function PrintReport() {
	const report = useStudio((s) => s.report);
	const scores = useStudio((s) => s.scores);
	const intel = useStudio((s) => s.intel);
	const idea = useStudio((s) => s.idea);
	const deep = useStudio((s) => s.deep);
	if (!report || !intel || !scores) return null;
	const alternatives = report.alternatives?.length ? report.alternatives : rankAlternatives(intel, idea);
	const dated = (/* @__PURE__ */ new Date()).toLocaleDateString("en-PH", {
		year: "numeric",
		month: "long",
		day: "numeric"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		id: "print-report",
		className: "hidden print:block",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "print-cover",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "print-kicker",
						children: "Feasify · Site research studio"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: report.title }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "print-meta",
						children: [
							dated,
							deep ? " · Deep research" : "",
							" · Google Map pin ",
							intel.lat.toFixed(5),
							", ",
							intel.lng.toFixed(5)
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "print-verdict",
						children: [
							VERDICT$1[report.verdict],
							" · ",
							report.feasibilityScore,
							"/100"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: intel.displayName })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "I. Executive summary" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: report.summary }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Proposed business" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: idea })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Foot traffic" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [scores.footTraffic, "/100"] })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Demand" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [scores.demand, "/100"] })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Access" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [scores.access, "/100"] })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Competition" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [scores.competition, "/100 (higher = more crowded)"] })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Overall site" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [scores.overall, "/100"] })] })
				] }) })
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "II. Location analysis" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: report.location.footTraffic }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: report.location.demographics }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: report.location.access }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Nearby mix (850 m)" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Category" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Count" })] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: Object.keys(intel.counts).map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: kindLabel(k) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: intel.counts[k] })] }, k)) })] })
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "III. Market" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Demand." }),
					" ",
					report.market.demand
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Competition." }),
					" ",
					report.market.competition
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Positioning." }),
					" ",
					report.market.positioning
				] })
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "IV. Technical" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: report.technical || "Confirm occupancy type with the city building official before fit-out." })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "V. Organization and management" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: report.management || "Owner-operator for the first six months with one closer and simple daily cash control." })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "VI. Financial (directional, PHP)" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Startup cost" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: php(report.financials.startupCostPhp) })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Revenue / month (year 1)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: php(report.financials.monthlyRevenuePhp) })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Opex / month" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: php(report.financials.monthlyOpexPhp) })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Break-even" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [report.financials.breakEvenMonths, " months"] })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Year-3 ROI" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [report.financials.year3RoiPct, "%"] })] })
				] }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: report.financials.notes })
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "VII. Socio-economic" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: report.socioeconomic || "A micro outlet keeps spend inside the barangay if the offer complements, rather than undercuts, older stores." })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "VIII. Alternative businesses ranked by feasibility on this pin" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Same lot, other MSME ideas scored against the live amenity mix. Rank 1 is the strongest alternative if the proposed idea is weak or crowded." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Rank" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Idea" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Score" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Verdict" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Why this pin" })
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: alternatives.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: a.rank }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: a.idea }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [a.score, "/100"] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: VERDICT$1[a.verdict] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: a.why })
				] }, a.idea)) })] })
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "IX. Risks" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", { children: report.risks.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
					r.title,
					" (",
					r.level,
					")"
				] }),
				"— ",
				r.detail
			] }, r.title)) })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "X. Permits" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", { children: report.permits.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [p.name, "."] }),
				" ",
				p.note
			] }, p.name)) })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "XI. Recommendations" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", { children: report.recommendations.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: r }, r)) })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "XII. Research log" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", { children: report.researchLog.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [s.step, "."] }),
				" ",
				s.finding
			] }, s.step)) })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", { children: "Prepared with Feasify. Location intelligence from the live map pin and amenity scan. Financials are directional MSME ranges, not a bank-ready audit." })
		]
	});
}
var generateFeasibilityStudy = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("84c04695162596c46ea9c6ecd9cba7dd5d05f049f3f45cceb823e5f371826118"));
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[opacity,transform,background-color,color] duration-[var(--motion-quick)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:opacity-90",
			secondary: "bg-surface-2 text-fg shadow-border hover:bg-surface",
			outline: "bg-transparent text-fg shadow-border hover:bg-surface-2",
			ghost: "text-muted hover:text-fg hover:bg-surface-2",
			danger: "bg-nogo/20 text-nogo hover:bg-nogo/30"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-xs",
			lg: "h-12 px-5",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
	className: cn("flex min-h-20 w-full rounded-lg bg-surface-2 px-3 py-2.5 text-sm text-fg shadow-border placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-40", className),
	ref,
	...props
}));
Textarea.displayName = "Textarea";
var IDEAS = [
	"Coffee shop with study nooks",
	"Neighborhood bakery",
	"Sari-sari store with water refilling",
	"24-hour car wash",
	"Small lodging near campus"
];
function PromptDock() {
	const idea = useStudio((s) => s.idea);
	const deep = useStudio((s) => s.deep);
	const pin = useStudio((s) => s.pin);
	const intel = useStudio((s) => s.intel);
	const scores = useStudio((s) => s.scores);
	const generating = useStudio((s) => s.generating);
	const report = useStudio((s) => s.report);
	const intelLoading = useStudio((s) => s.intelLoading);
	const setIdea = useStudio((s) => s.setIdea);
	const setDeep = useStudio((s) => s.setDeep);
	const setGenerating = useStudio((s) => s.setGenerating);
	const setError = useStudio((s) => s.setError);
	const setReport = useStudio((s) => s.setReport);
	const saveStudy = useStudio((s) => s.saveStudy);
	const [asked, setAsked] = (0, import_react.useState)(false);
	const ready = Boolean(pin && intel && scores && !intelLoading);
	const canGenerate = ready && idea.trim().length > 2 && !generating;
	async function generate() {
		if (!intel || !scores) return;
		setAsked(true);
		setGenerating(true);
		setError(null);
		const result = await generateFeasibilityStudy({ data: {
			idea: idea.trim(),
			deep,
			intel,
			scores
		} });
		if (!result.ok) {
			setError(result.error);
			return;
		}
		setReport(result.report);
		saveStudy({
			id: uid(),
			createdAt: Date.now(),
			businessIdea: idea.trim(),
			deep,
			intel,
			scores,
			report: result.report
		});
	}
	if (generating || report) return null;
	if (!pin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-auto max-w-lg rounded-2xl bg-surface/95 px-5 py-4 shadow-border backdrop-blur-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-lg text-fg",
				children: "Pin a lot. Prove the business."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Click the map — or search a barangay — then tell the research agent what you want to open."
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-auto w-full max-w-2xl rounded-2xl bg-surface/95 p-3 shadow-border backdrop-blur-sm md:p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-center justify-between gap-3 px-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-fg",
						children: asked ? "What should we test here?" : "What business do you want to do here?"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex cursor-pointer items-center gap-2 text-xs text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Deep research" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							role: "switch",
							"aria-checked": deep,
							onClick: () => setDeep(!deep),
							className: `relative h-6 w-10 rounded-full transition-colors ${deep ? "bg-accent" : "bg-surface-2"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `absolute top-0.5 left-0.5 size-5 rounded-full bg-fg transition-transform ${deep ? "translate-x-4 bg-accent-fg" : ""}` })
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: idea,
					onChange: (e) => setIdea(e.target.value),
					placeholder: "e.g. a quiet coffee shop for students, 30 seats, open until 10pm",
					rows: 2,
					onKeyDown: (e) => {
						if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && canGenerate) {
							e.preventDefault();
							generate();
						}
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 flex flex-wrap gap-1.5",
					children: IDEAS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setIdea(item),
						className: "rounded-full bg-surface-2 px-2.5 py-1 text-xs text-muted hover:text-fg",
						children: item
					}, item))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-subtle",
						children: intelLoading ? "Reading the block — shops, schools, transit…" : ready ? `${intel?.pois.length ?? 0} nearby places mapped` : "Waiting on location data"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "lg",
						disabled: !canGenerate,
						onClick: () => void generate(),
						children: [generating ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSearch, {}), generating ? "Researching" : deep ? "Run deep study" : "Generate study"]
					})]
				})
			]
		})
	});
}
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
	type,
	className: cn("flex h-11 w-full rounded-lg bg-surface-2 px-3 text-sm text-fg shadow-border placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-40", className),
	ref,
	...props
}));
Input.displayName = "Input";
var SUGGESTIONS = [
	{
		label: "Uptown Cagayan de Oro",
		lat: 8.4542,
		lng: 124.6319
	},
	{
		label: "Divisoria, CDO",
		lat: 8.4824,
		lng: 124.6508
	},
	{
		label: "Cogon Market, CDO",
		lat: 8.4776,
		lng: 124.6519
	},
	{
		label: "Xavier University, CDO",
		lat: 8.4854,
		lng: 124.6572
	}
];
function SearchBar() {
	const setPin = useStudio((s) => s.setPin);
	const [q, setQ] = (0, import_react.useState)("");
	const [hits, setHits] = (0, import_react.useState)([]);
	const [open, setOpen] = (0, import_react.useState)(false);
	const skipSearch = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
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
	function pick(lat, lng, label) {
		skipSearch.current = true;
		setPin({
			lat,
			lng
		});
		if (label) setQ(label);
		setHits([]);
		setOpen(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-col items-center gap-2 p-3 pt-[max(0.75rem,env(safe-area-inset-top))] pl-16 md:p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-auto relative w-full max-w-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-subtle" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: q,
					onChange: (e) => setQ(e.target.value),
					onFocus: () => hits.length && setOpen(true),
					placeholder: "Search a street, barangay, or city",
					className: "h-12 rounded-xl bg-surface/95 pl-10 pr-3 shadow-border backdrop-blur-sm",
					"aria-label": "Search location"
				}),
				open && hits.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "absolute mt-2 w-full overflow-hidden rounded-xl bg-surface shadow-border",
					children: hits.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex w-full items-start gap-2 px-3 py-3 text-left text-sm hover:bg-surface-2",
						onClick: () => pick(h.lat, h.lng, h.label),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mt-0.5 size-4 shrink-0 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-fg",
							children: h.label
						})]
					}) }, `${h.lat}-${h.lng}-${h.label}`))
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-auto flex w-full max-w-xl gap-2 overflow-x-auto pb-1",
			children: SUGGESTIONS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => pick(s.lat, s.lng, s.label),
				className: "shrink-0 rounded-full bg-surface/90 px-3 py-2 text-xs text-muted shadow-border hover:text-fg",
				children: s.label
			}, s.label))
		})]
	});
}
function Sidebar() {
	const studies = useStudio((s) => s.studies);
	const activeId = useStudio((s) => s.activeId);
	const open = useStudio((s) => s.sidebarOpen);
	const setOpen = useStudio((s) => s.setSidebarOpen);
	const loadStudy = useStudio((s) => s.loadStudy);
	const deleteStudy = useStudio((s) => s.deleteStudy);
	const newStudy = useStudio((s) => s.newStudy);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "secondary",
			size: "icon",
			className: "absolute top-[max(0.75rem,env(safe-area-inset-top))] left-3 z-30 md:hidden",
			"aria-label": "Open studies",
			onClick: () => setOpen(true),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {})
		}),
		open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "absolute inset-0 z-40 bg-bg/50 md:hidden",
			"aria-label": "Close menu",
			onClick: () => setOpen(false)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: cn("absolute inset-y-0 left-0 z-50 flex w-72 shrink-0 flex-col border-r border-border bg-surface transition-transform duration-200 ease-out md:static md:z-10 md:translate-x-0", open ? "translate-x-0" : "-translate-x-full md:translate-x-0"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5 border-b border-border px-4 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-8 items-center justify-center rounded-lg bg-accent text-accent-fg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							viewBox: "0 0 24 24",
							className: "size-4",
							fill: "none",
							"aria-hidden": true,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
									cx: "12",
									cy: "12",
									r: "7",
									stroke: "currentColor",
									strokeWidth: "1.6"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
									cx: "12",
									cy: "12",
									r: "2.2",
									fill: "currentColor"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: "M12 2v3M12 19v3M2 12h3M19 12h3",
									stroke: "currentColor",
									strokeWidth: "1.6"
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg leading-tight",
						children: "Feasify"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] tracking-wide text-subtle",
						children: "Site research studio"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "w-full",
						onClick: () => {
							newStudy();
							setOpen(false);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), " New study"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-4 pb-2 text-xs uppercase tracking-widest text-subtle",
					children: "Saved"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "min-h-0 flex-1 overflow-y-auto px-2 pb-4",
					children: [studies.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-2 text-sm text-muted",
						children: "Pin a site and generate a study. It will live here."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-1",
						children: studies.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "group relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									loadStudy(s.id);
									setOpen(false);
								},
								className: cn("w-full rounded-lg px-3 py-2.5 text-left hover:bg-surface-2", activeId === s.id && "bg-surface-2"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-sm text-fg",
									children: s.businessIdea
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block truncate text-xs text-subtle",
									children: [s.intel.neighbourhood || s.intel.city || "Pinned site", s.deep ? " · Deep" : ""]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Delete study",
								className: "absolute top-2 right-2 hidden size-8 items-center justify-center rounded-md text-subtle hover:text-nogo group-hover:flex",
								onClick: (e) => {
									e.stopPropagation();
									deleteStudy(s.id);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
							})]
						}, s.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "border-t border-border px-4 py-3 text-[11px] leading-relaxed text-subtle",
					children: "Deep research is the paid R&D agent: longer reasoning, sensitivity, and a fuller permit path."
				})
			]
		})
	] });
}
var badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide", {
	variants: { variant: {
		default: "bg-surface-2 text-muted",
		go: "bg-go/15 text-go",
		caution: "bg-caution/15 text-caution",
		nogo: "bg-nogo/15 text-nogo",
		accent: "bg-accent text-accent-fg"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
var VERDICT = {
	go: {
		label: "Feasible",
		variant: "go"
	},
	caution: {
		label: "Proceed with care",
		variant: "caution"
	},
	"no-go": {
		label: "Weak site",
		variant: "nogo"
	}
};
function Meter({ label, value, invert }) {
	const tone = invert ? value >= 75 ? "bg-nogo" : value >= 50 ? "bg-caution" : "bg-go" : value >= 70 ? "bg-go" : value >= 45 ? "bg-caution" : "bg-nogo";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-1 flex items-baseline justify-between text-xs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "font-mono tabular-nums text-fg",
			children: [
				value,
				" · ",
				scoreLabel(invert ? 100 - value : value)
			]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-1.5 overflow-hidden rounded-full bg-surface-2",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `h-full rounded-full ${tone}`,
			style: { width: `${value}%` }
		})
	})] });
}
function StudyPanel() {
	const report = useStudio((s) => s.report);
	const scores = useStudio((s) => s.scores);
	const intel = useStudio((s) => s.intel);
	const generating = useStudio((s) => s.generating);
	const error = useStudio((s) => s.error);
	const idea = useStudio((s) => s.idea);
	const setReport = useStudio((s) => s.setReport);
	const setError = useStudio((s) => s.setError);
	if (!intel && !generating && !report) return null;
	if (!Boolean(report || generating || error)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
		className: "pointer-events-none absolute top-32 right-3 z-20 hidden w-72 md:block",
		children: intel && scores && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-auto rounded-2xl bg-surface/95 p-4 shadow-border backdrop-blur-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-widest text-subtle",
					children: "Site read"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 font-display text-xl text-fg",
					children: intel.neighbourhood || intel.city || "Pinned site"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 line-clamp-2 text-xs text-muted",
					children: intel.displayName
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
							label: "Foot traffic",
							value: scores.footTraffic
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
							label: "Demand",
							value: scores.demand
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
							label: "Access",
							value: scores.access
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
							label: "Competition",
							value: scores.competition,
							invert: true
						})
					]
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		id: "study-print",
		className: "absolute inset-x-0 bottom-0 z-30 flex h-4/5 flex-col rounded-t-2xl bg-surface shadow-border md:inset-y-0 md:right-0 md:left-auto md:h-auto md:w-[26.25rem] md:rounded-none md:border-l md:border-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-start justify-between gap-3 border-b border-border px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-widest text-subtle",
					children: "Feasibility study"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-0.5 truncate font-display text-xl text-fg",
					children: report?.title ?? (generating ? "Research agent at work" : "Study")
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1",
				children: [report && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					onClick: () => window.print(),
					"aria-label": "Print study",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					"aria-label": "Close study",
					onClick: () => {
						setReport(null);
						setError(null);
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-0 flex-1 overflow-y-auto px-4 py-4",
			children: [
				generating && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "space-y-3",
					children: [
						"Location scout reading the block",
						"Foot-traffic proxy from shops and transit",
						"Competitor density against your idea",
						"Briefing the research agent",
						"Drafting market, permits, and numbers"
					].map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-3 text-sm text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono tabular-nums text-subtle",
							children: String(i + 1).padStart(2, "0")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shimmer",
							children: step
						})]
					}, step))
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-xl bg-nogo/10 px-3 py-3 text-sm text-nogo",
					children: error
				}),
				report && scores && intel && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: VERDICT[report.verdict].variant,
									children: VERDICT[report.verdict].label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-sm tabular-nums text-fg",
									children: [report.feasibilityScore, "/100"]
								}),
								idea && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted",
									children: idea
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm leading-relaxed text-fg",
							children: report.summary
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "space-y-3 rounded-xl bg-surface-2 p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-subtle",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "size-3.5" }), " Location"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
									label: "Overall site",
									value: scores.overall
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
									label: "Foot traffic",
									value: scores.footTraffic
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
									label: "Demand",
									value: scores.demand
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
									label: "Access",
									value: scores.access
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
									label: "Competition",
									value: scores.competition,
									invert: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted",
									children: report.location.footTraffic
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted",
									children: report.location.demographics
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted",
									children: report.location.access
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-2 text-xs font-medium uppercase tracking-widest text-subtle",
							children: "Nearby mix"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "grid grid-cols-2 gap-2 text-xs",
							children: Object.keys(intel.counts).map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex justify-between rounded-lg bg-surface-2 px-2.5 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted",
									children: kindLabel(k)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono tabular-nums text-fg",
									children: intel.counts[k]
								})]
							}, k))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-xs font-medium uppercase tracking-widest text-subtle",
									children: "Market"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-fg",
									children: report.market.demand
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted",
									children: report.market.competition
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted",
									children: report.market.positioning
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-3 text-xs font-medium uppercase tracking-widest text-subtle",
								children: "Directional financials"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-3 h-36",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
									width: "100%",
									height: "100%",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
										data: [
											{
												name: "Startup",
												v: report.financials.startupCostPhp
											},
											{
												name: "Rev / mo",
												v: report.financials.monthlyRevenuePhp
											},
											{
												name: "Opex / mo",
												v: report.financials.monthlyOpexPhp
											}
										],
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
												dataKey: "name",
												tick: {
													fill: "var(--color-muted)",
													fontSize: 11
												},
												axisLine: false,
												tickLine: false
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { hide: true }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
												formatter: (v) => php(Number(v)),
												contentStyle: {
													background: "var(--color-surface)",
													border: "1px solid var(--color-border)",
													borderRadius: 8,
													color: "var(--color-fg)"
												}
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
												dataKey: "v",
												fill: "var(--color-accent)",
												radius: [
													6,
													6,
													0,
													0
												]
											})
										]
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "grid grid-cols-2 gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-surface-2 px-3 py-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted",
										children: "Break-even"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
										className: "font-mono tabular-nums",
										children: [report.financials.breakEvenMonths, " mo"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-surface-2 px-3 py-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted",
										children: "Year-3 ROI"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
										className: "font-mono tabular-nums",
										children: [report.financials.year3RoiPct, "%"]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-subtle",
								children: report.financials.notes
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-2 text-xs font-medium uppercase tracking-widest text-subtle",
							children: "Risks"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2",
							children: report.risks.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-lg bg-surface-2 px-3 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm text-fg",
										children: r.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: r.level === "high" ? "nogo" : r.level === "medium" ? "caution" : "go",
										children: r.level
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted",
									children: r.detail
								})]
							}, r.title))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-2 text-xs font-medium uppercase tracking-widest text-subtle",
							children: "Permits"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2",
							children: report.permits.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-fg",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted",
									children: [" — ", p.note]
								})]
							}, p.name))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-2 text-xs font-medium uppercase tracking-widest text-subtle",
							children: "Alternatives ranked on this pin"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "space-y-2",
							children: (report.alternatives?.length ? report.alternatives : rankAlternatives(intel, idea)).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-lg bg-surface-2 px-3 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-baseline justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-sm text-fg",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-mono text-xs text-subtle",
												children: ["#", a.rank]
											}),
											" ",
											a.idea
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: VERDICT[a.verdict].variant,
											children: VERDICT[a.verdict].label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-xs tabular-nums text-fg",
											children: a.score
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted",
									children: a.why
								})]
							}, a.idea))
						})] }),
						report.technical && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-xs font-medium uppercase tracking-widest text-subtle",
								children: "Technical"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: report.technical
							})]
						}),
						report.management && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-xs font-medium uppercase tracking-widest text-subtle",
								children: "Management"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: report.management
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-2 text-xs font-medium uppercase tracking-widest text-subtle",
							children: "What to do next"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "list-decimal space-y-1 pl-4 text-sm text-fg",
							children: report.recommendations.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: r }, r))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-2 text-xs font-medium uppercase tracking-widest text-subtle",
							children: "Agent log"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "space-y-2",
							children: report.researchLog.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono text-xs text-subtle",
										children: [String(i + 1).padStart(2, "0"), " "]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-fg",
										children: s.step
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 text-xs text-muted",
										children: s.finding
									})
								]
							}, s.step))
						})] })
					]
				})
			]
		})]
	});
}
function Studio() {
	const [layer, setLayer] = (0, import_react.useState)("roadmap");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh overflow-hidden bg-bg print:block print:h-auto print:overflow-visible",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-0 min-w-0 flex-1 overflow-hidden print:hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "relative min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapCanvas, { layer }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchBar, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeatLegend, {
						layer,
						onLayer: setLayer
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PromptDock, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudyPanel, {})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrintReport, {})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Studio, {});
}
//#endregion
export { Home as component };
