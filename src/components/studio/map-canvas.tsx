import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker, CircleMarker, TileLayer } from "leaflet";
import { fetchLocationIntel } from "@/lib/geo/location-intel";
import { scoreSite } from "@/lib/scoring";
import { useStudio } from "@/lib/store";
import type { PoiKind } from "@/lib/types";

const CDO: [number, number] = [8.4542, 124.6319];

const KIND_COLOR: Record<PoiKind, string> = {
  food: "#c17b6a",
  shop: "#8e8c84",
  school: "#8fad8c",
  health: "#8fad8c",
  transit: "#1a73e8",
  finance: "#c4a574",
  other: "#6b6a64",
};

export type GoogleLayer = "roadmap" | "satellite";

function googleUrl(layer: GoogleLayer) {
  const lyrs = layer === "satellite" ? "y" : "m";
  return `https://{s}.google.com/vt/lyrs=${lyrs}&hl=en&x={x}&y={y}&z={z}`;
}

export function MapCanvas({ layer }: { layer: GoogleLayer }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const tilesRef = useRef<TileLayer | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const heatRef = useRef<CircleMarker[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const pin = useStudio((s) => s.pin);
  const intel = useStudio((s) => s.intel);
  const idea = useStudio((s) => s.idea);
  const setPin = useStudio((s) => s.setPin);
  const setIntel = useStudio((s) => s.setIntel);
  const setScores = useStudio((s) => s.setScores);
  const setIntelLoading = useStudio((s) => s.setIntelLoading);
  const setError = useStudio((s) => s.setError);

  useEffect(() => {
    if (!hostRef.current || mapRef.current) return;
    let cancelled = false;

    (async () => {
      const L = await import("leaflet");
      if (cancelled || !hostRef.current) return;

      const map = L.map(hostRef.current, {
        zoomControl: false,
        attributionControl: true,
      }).setView(CDO, 15);

      const tiles = L.tileLayer(googleUrl("roadmap"), {
        maxZoom: 21,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
        attribution: "Map data &copy; Google",
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      map.on("click", (e) => {
        setPin({ lat: e.latlng.lat, lng: e.latlng.lng });
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

  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map) return;
    let cancelled = false;
    (async () => {
      const L = await import("leaflet");
      if (cancelled) return;
      if (tilesRef.current) tilesRef.current.remove();
      const tiles = L.tileLayer(googleUrl(layer), {
        maxZoom: 21,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
        attribution: "Map data &copy; Google",
      }).addTo(map);
      tilesRef.current = tiles;
    })();
    return () => {
      cancelled = true;
    };
  }, [layer, mapReady]);

  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map) return;
    let alive = true;

    (async () => {
      const L = await import("leaflet");
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      if (!pin) return;

      const icon = L.divIcon({
        className: "feasify-divicon",
        html: `<span class="feasify-pin block"></span>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

      const marker = L.marker([pin.lat, pin.lng], { icon, draggable: true }).addTo(map);
      marker.on("dragend", () => {
        const p = marker.getLatLng();
        setPin({ lat: p.lat, lng: p.lng });
      });
      markerRef.current = marker;
      map.panTo([pin.lat, pin.lng], { animate: true });

      setIntelLoading(true);
      const result = await fetchLocationIntel({ data: { lat: pin.lat, lng: pin.lng } });
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
  }, [pin, mapReady, setError, setIntel, setIntelLoading, setPin]);

  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map) return;
    let cancelled = false;

    (async () => {
      const L = await import("leaflet");
      if (cancelled) return;
      for (const c of heatRef.current) c.remove();
      heatRef.current = [];
      if (!intel) return;
      heatRef.current = intel.pois.map((p) =>
        L.circleMarker([p.lat, p.lng], {
          radius: p.kind === "transit" ? 7 : 5,
          color: KIND_COLOR[p.kind],
          weight: 0,
          fillOpacity: 0.55,
        })
          .bindTooltip(`${p.name} · ${p.kind}`, { opacity: 0.92 })
          .addTo(map),
      );
    })();

    return () => {
      cancelled = true;
    };
  }, [intel, mapReady]);

  useEffect(() => {
    const intelNow = useStudio.getState().intel;
    if (!intelNow) return;
    setScores(scoreSite(intelNow, idea));
  }, [idea, setScores]);

  return <div ref={hostRef} className="absolute inset-0 z-0" />;
}
