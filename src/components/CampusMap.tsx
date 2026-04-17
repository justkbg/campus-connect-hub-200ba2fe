import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline, useMap, CircleMarker, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons in Leaflet + bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// UPSA Campus center (Madina, Accra)
export const UPSA_CENTER: [number, number] = [5.6502, -0.1758];

export type CampusBuilding = {
  id: number;
  name: string;
  category: string;
  position: [number, number];
  polygon?: [number, number][];
};

// Realistic UPSA building layout (approximate, simulated for demo)
export const upsaBuildings: CampusBuilding[] = [
  {
    id: 1,
    name: "Lecture Theatre 1 (LT1)",
    category: "Academic",
    position: [5.65045, -0.17545],
    polygon: [
      [5.65040, -0.17555],
      [5.65055, -0.17555],
      [5.65055, -0.17535],
      [5.65040, -0.17535],
    ],
  },
  {
    id: 2,
    name: "Lecture Theatre 3 (LT3)",
    category: "Academic",
    position: [5.65095, -0.17605],
    polygon: [
      [5.65088, -0.17615],
      [5.65103, -0.17615],
      [5.65103, -0.17595],
      [5.65088, -0.17595],
    ],
  },
  {
    id: 3,
    name: "Main Library",
    category: "Academic",
    position: [5.64985, -0.17475],
    polygon: [
      [5.64975, -0.17490],
      [5.64995, -0.17490],
      [5.64995, -0.17460],
      [5.64975, -0.17460],
    ],
  },
  {
    id: 4,
    name: "ICT Lab",
    category: "Academic",
    position: [5.65160, -0.17680],
    polygon: [
      [5.65152, -0.17692],
      [5.65170, -0.17692],
      [5.65170, -0.17670],
      [5.65152, -0.17670],
    ],
  },
  {
    id: 5,
    name: "Admin Block",
    category: "Administrative",
    position: [5.64880, -0.17370],
    polygon: [
      [5.64870, -0.17385],
      [5.64890, -0.17385],
      [5.64890, -0.17355],
      [5.64870, -0.17355],
    ],
  },
  {
    id: 6,
    name: "Banking Square",
    category: "Services",
    position: [5.64755, -0.17520],
  },
  { id: 7, name: "Print Hub", category: "Services", position: [5.64960, -0.17440] },
  {
    id: 8,
    name: "Student Center",
    category: "Social",
    position: [5.65120, -0.17410],
    polygon: [
      [5.65110, -0.17425],
      [5.65130, -0.17425],
      [5.65130, -0.17395],
      [5.65110, -0.17395],
    ],
  },
  { id: 9, name: "Sports Complex", category: "Social", position: [5.65340, -0.17820] },
  { id: 10, name: "Cafeteria", category: "Services", position: [5.64985, -0.17485] },
];

const categoryColor: Record<string, string> = {
  Academic: "hsl(217 91% 53%)",
  Services: "hsl(160 84% 39%)",
  Administrative: "hsl(38 92% 50%)",
  Social: "hsl(213 94% 68%)",
};

function makePinIcon(color: string, active = false) {
  const size = active ? 38 : 30;
  const ring = active ? 4 : 2;
  return L.divIcon({
    className: "campus-pin",
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:50%;
      background:${color};
      box-shadow:0 0 0 ${ring}px rgba(255,255,255,0.95), 0 6px 16px rgba(15,23,42,0.25);
      display:flex;align-items:center;justify-content:center;
      transform: translateY(0);
      transition: transform .2s ease;
    ">
      <div style="width:8px;height:8px;border-radius:50%;background:#fff;"></div>
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function FlyTo({ position }: { position: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 18, { duration: 0.9 });
  }, [position, map]);
  return null;
}

function FitRoute({ path }: { path: [number, number][] | null }) {
  const map = useMap();
  useEffect(() => {
    if (path && path.length > 1) {
      const bounds = L.latLngBounds(path.map((p) => L.latLng(p[0], p[1])));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 18, animate: true });
    }
  }, [path, map]);
  return null;
}

export type RouteStep = {
  instruction: string;
  distance: number;
  duration: number;
  modifier?: string;
  type?: string;
  name?: string;
};

type Props = {
  buildings?: CampusBuilding[];
  selectedId?: number | null;
  onSelect?: (b: CampusBuilding) => void;
  routeFrom?: [number, number];
  routeTo?: [number, number] | null;
  userPosition?: [number, number] | null;
  userAccuracy?: number | null;
  onRouteSteps?: (steps: RouteStep[], totals: { distance: number; duration: number } | null) => void;
  accessibleMode?: boolean;
  recenterSignal?: number;
};

function RecenterControl({ position, signal }: { position: [number, number] | null; signal?: number }) {
  const map = useMap();
  useEffect(() => {
    if (signal && position) {
      map.flyTo(position, 18, { duration: 0.7 });
    }
  }, [signal, position, map]);
  return null;
}

function bearingToCardinal(b: number) {
  const dirs = ["north", "north-east", "east", "south-east", "south", "south-west", "west", "north-west"];
  return dirs[Math.round(((b % 360) + 360) % 360 / 45) % 8];
}

function humanizeStep(step: any): string {
  const m = step?.maneuver ?? {};
  const type = m.type as string | undefined;
  const modifier = m.modifier as string | undefined;
  const name = step?.name && String(step.name).trim() ? step.name : "";
  const dist = Math.round(step?.distance ?? 0);
  const distStr = dist >= 1000 ? `${(dist / 1000).toFixed(1)}km` : `${dist}m`;

  if (type === "depart") {
    const dir = m.bearing_after != null ? bearingToCardinal(m.bearing_after) : "";
    return `Head ${dir || "forward"}${name ? ` on ${name}` : ""} for ${distStr}`;
  }
  if (type === "arrive") return "Arrive at destination";
  if (type === "roundabout" || type === "rotary") {
    return `Take the roundabout${modifier ? ` ${modifier}` : ""}${name ? ` onto ${name}` : ""} • ${distStr}`;
  }
  if (modifier) {
    return `Turn ${modifier}${name ? ` onto ${name}` : ""} • ${distStr}`;
  }
  return `Continue${name ? ` on ${name}` : ""} • ${distStr}`;
}

export default function CampusMap({
  buildings = upsaBuildings,
  selectedId,
  onSelect,
  routeFrom,
  routeTo,
  userPosition,
  userAccuracy,
  onRouteSteps,
  accessibleMode = false,
  recenterSignal,
}: Props) {
  const selected = buildings.find((b) => b.id === selectedId) ?? null;
  const [routePath, setRoutePath] = useState<[number, number][] | null>(null);
  const [routing, setRouting] = useState(false);

  // Fetch turn-by-turn route from public OSRM demo server
  useEffect(() => {
    let cancelled = false;
    if (!routeFrom || !routeTo) {
      setRoutePath(null);
      onRouteSteps?.([], null);
      return;
    }
    setRouting(true);
    const url = `https://router.project-osrm.org/route/v1/foot/${routeFrom[1]},${routeFrom[0]};${routeTo[1]},${routeTo[0]}?overview=full&geometries=geojson&steps=true`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const route = data?.routes?.[0];
        const coords = route?.geometry?.coordinates;
        if (Array.isArray(coords)) {
          setRoutePath(coords.map((c: [number, number]) => [c[1], c[0]]));
        } else {
          setRoutePath([routeFrom, routeTo]);
        }
        const legs = route?.legs ?? [];
        const allSteps: any[] = legs.flatMap((l: any) => l.steps ?? []);
        const humanSteps: RouteStep[] = allSteps
          .map((s) => ({
            instruction: humanizeStep(s),
            distance: Math.round(s?.distance ?? 0),
            duration: Math.round(s?.duration ?? 0),
            modifier: s?.maneuver?.modifier,
            type: s?.maneuver?.type,
            name: s?.name,
          }))
          .filter((s, idx) => s.type === "arrive" || s.distance > 0 || idx === 0);
        onRouteSteps?.(
          humanSteps,
          route ? { distance: Math.round(route.distance), duration: Math.round(route.duration) } : null
        );
      })
      .catch(() => {
        if (!cancelled) {
          setRoutePath([routeFrom, routeTo]);
          onRouteSteps?.([], null);
        }
      })
      .finally(() => !cancelled && setRouting(false));
    return () => {
      cancelled = true;
    };
  }, [routeFrom?.[0], routeFrom?.[1], routeTo?.[0], routeTo?.[1]]);

  return (
    <MapContainer
      center={UPSA_CENTER}
      zoom={17}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%", borderRadius: "1rem", background: "hsl(210 20% 96%)" }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      {/* Building polygons */}
      {buildings.map(
        (b) =>
          b.polygon && (
            <Polygon
              key={`poly-${b.id}`}
              positions={b.polygon}
              pathOptions={{
                color: categoryColor[b.category] ?? "hsl(217 91% 53%)",
                weight: 1.5,
                fillOpacity: selectedId === b.id ? 0.55 : 0.25,
              }}
              eventHandlers={{ click: () => onSelect?.(b) }}
            />
          )
      )}

      {/* Pins */}
      {buildings.map((b) => (
        <Marker
          key={b.id}
          position={b.position}
          icon={makePinIcon(categoryColor[b.category] ?? "hsl(217 91% 53%)", selectedId === b.id)}
          eventHandlers={{ click: () => onSelect?.(b) }}
        >
          <Popup>
            <div style={{ fontFamily: "Inter, sans-serif", minWidth: 140 }}>
              <strong style={{ fontSize: 13 }}>{b.name}</strong>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{b.category}</div>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* User position with accuracy halo */}
      {userPosition && (
        <>
          {userAccuracy && userAccuracy > 0 && (
            <Circle
              center={userPosition}
              radius={Math.min(userAccuracy, 80)}
              pathOptions={{
                color: "hsl(217 91% 53%)",
                fillColor: "hsl(217 91% 53%)",
                fillOpacity: 0.12,
                weight: 1,
                opacity: 0.4,
              }}
            />
          )}
          <CircleMarker
            center={userPosition}
            radius={7}
            pathOptions={{
              color: "#fff",
              fillColor: "hsl(217 91% 53%)",
              fillOpacity: 1,
              weight: 3,
            }}
          />
        </>
      )}

      {/* Route — turn-by-turn polyline */}
      {routeFrom && routeTo && routePath && (
        <>
          {/* Outer halo */}
          <Polyline
            positions={routePath}
            pathOptions={{
              color: "#fff",
              weight: 8,
              opacity: 0.9,
              lineCap: "round",
              lineJoin: "round",
            }}
          />
          {/* Inner route */}
          <Polyline
            positions={routePath}
            pathOptions={{
              color: "hsl(217 91% 53%)",
              weight: 5,
              opacity: 0.95,
              lineCap: "round",
              lineJoin: "round",
              dashArray: routing ? "6 8" : undefined,
            }}
          />
        </>
      )}

      {routePath && <FitRoute path={routePath} />}
      {!routePath && <FlyTo position={selected?.position ?? null} />}
    </MapContainer>
  );
}
