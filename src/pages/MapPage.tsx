import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, MapPin, Navigation, Clock, Footprints, X, LocateFixed, Loader2, Droplet, Printer, Landmark, Coffee, ArrowUpRight, ArrowRight, ArrowLeft, CornerUpRight, CornerUpLeft, Flag, Route, Accessibility, Crosshair } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageShell from "@/components/PageShell";
import BottomNav from "@/components/BottomNav";
import CampusMap, { upsaBuildings, UPSA_CENTER, CampusBuilding, RouteStep } from "@/components/CampusMap";
import { todaySchedule } from "@/data/mockData";

const categories = ["All", "Academic", "Services", "Administrative", "Social"];

// Quick-service chips — match by keywords against building name
type ServiceChip = { key: string; label: string; icon: typeof Droplet; match: (name: string) => boolean };
const serviceChips: ServiceChip[] = [
  { key: "washroom", label: "Washroom", icon: Droplet, match: (n) => /washroom|toilet|restroom/i.test(n) },
  { key: "print", label: "Print", icon: Printer, match: (n) => /print/i.test(n) },
  { key: "atm", label: "ATM", icon: Landmark, match: (n) => /atm|bank/i.test(n) },
  { key: "cafe", label: "Cafeteria", icon: Coffee, match: (n) => /cafe|caf[eé]teria|food/i.test(n) },
];

// Fallback simulated position (used if geolocation denied/unavailable)
const FALLBACK_POSITION: [number, number] = [5.65080, -0.17460];

// Bounding box around UPSA campus — clamp far-off real positions for demo realism
const CAMPUS_BBOX = {
  minLat: 5.6460, maxLat: 5.6545,
  minLng: -0.1820, maxLng: -0.1700,
};
function withinCampus(p: [number, number]) {
  return p[0] >= CAMPUS_BBOX.minLat && p[0] <= CAMPUS_BBOX.maxLat
      && p[1] >= CAMPUS_BBOX.minLng && p[1] <= CAMPUS_BBOX.maxLng;
}

function haversineMeters(a: [number, number], b: [number, number]) {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const x =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(x));
}

function walkingTime(from: [number, number], to: [number, number]) {
  const meters = haversineMeters(from, to);
  const minutes = Math.max(1, Math.round(meters / 80)); // ~80 m/min walking
  return { meters: Math.round(meters), minutes };
}

type GeoState = "idle" | "prompting" | "granted" | "denied" | "unavailable" | "off-campus";

export default function MapPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [selected, setSelected] = useState<CampusBuilding | null>(null);
  const [routing, setRouting] = useState(false);
  const [userPos, setUserPos] = useState<[number, number]>(FALLBACK_POSITION);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [geoState, setGeoState] = useState<GeoState>("idle");
  const [steps, setSteps] = useState<RouteStep[]>([]);
  const [routeTotals, setRouteTotals] = useState<{ distance: number; duration: number } | null>(null);
  const [accessibleMode, setAccessibleMode] = useState(false);
  const [recenterSignal, setRecenterSignal] = useState(0);
  const watchIdRef = useRef<number | null>(null);

  const nextClass = todaySchedule.find((c) => c.status === "upcoming");

  const findNearestService = (chip: ServiceChip) => {
    const named = upsaBuildings.filter((b) => chip.match(b.name));
    const pool = named.length ? named : upsaBuildings.filter((b) => b.category === "Services");
    if (!pool.length) return null;
    return pool
      .map((b) => ({ b, d: haversineMeters(userPos, b.position) }))
      .sort((a, z) => a.d - z.d)[0].b;
  };

  const handleServiceChip = (chip: ServiceChip) => {
    const target = findNearestService(chip);
    if (target) {
      setSelected(target);
      setRouting(true);
    }
  };

  // Deep-link: ?to=<buildingId> auto-selects and routes
  useEffect(() => {
    const toId = searchParams.get("to");
    if (!toId) return;
    const target = upsaBuildings.find((b) => String(b.id) === toId);
    if (target) {
      setSelected(target);
      setRouting(true);
      const next = new URLSearchParams(searchParams);
      next.delete("to");
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestLocation = () => {
    if (!("geolocation" in navigator)) {
      setGeoState("unavailable");
      return;
    }
    setGeoState("prompting");
    // Clear any prior watch
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const p: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setAccuracy(pos.coords.accuracy ?? null);
        if (withinCampus(p)) {
          setUserPos(p);
          setGeoState("granted");
        } else {
          // Off-campus — keep showing campus fallback so the demo stays meaningful
          setUserPos(FALLBACK_POSITION);
          setGeoState("off-campus");
        }
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) setGeoState("denied");
        else setGeoState("unavailable");
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  const filtered = useMemo(
    () =>
      upsaBuildings.filter((l) => {
        const matchSearch = l.name.toLowerCase().includes(search.toLowerCase());
        const matchCat = cat === "All" || l.category === cat;
        return matchSearch && matchCat;
      }),
    [search, cat]
  );

  const enriched = useMemo(
    () =>
      filtered
        .map((l) => ({ ...l, ...walkingTime(userPos, l.position) }))
        .sort((a, b) => a.meters - b.meters),
    [filtered, userPos]
  );

  const routeTo = routing && selected ? selected.position : null;
  const selectedWalk = selected ? walkingTime(userPos, selected.position) : null;

  return (
    <PageShell>
      <div className="max-w-lg mx-auto pb-24">
        <div className="px-5 pt-12 pb-4">
          <div className="flex items-baseline justify-between mb-4">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Campus Map</h1>
            <span className="text-[11px] text-muted-foreground">UPSA · Madina</span>
          </div>

          {/* Search + Locate */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 flex items-center gap-3 bg-muted rounded-xl px-4 py-3">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search lecture halls, services, offices…"
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              />
            </div>
            <button
              onClick={requestLocation}
              aria-label="Use my location"
              className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                geoState === "granted"
                  ? "gradient-primary text-primary-foreground shadow-premium"
                  : "bg-muted text-foreground hover:bg-muted/70"
              }`}
            >
              {geoState === "prompting" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LocateFixed className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Geo state hint */}
          {geoState === "denied" && (
            <p className="text-[11px] text-muted-foreground mb-2">
              Location permission denied — showing simulated campus position.
            </p>
          )}
          {geoState === "off-campus" && (
            <p className="text-[11px] text-muted-foreground mb-2">
              You're not on campus right now — showing simulated UPSA position for demo.
            </p>
          )}
          {geoState === "unavailable" && (
            <p className="text-[11px] text-muted-foreground mb-2">
              Live location unavailable on this device.
            </p>
          )}

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all ${
                  cat === c
                    ? "gradient-primary text-primary-foreground shadow-premium"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Quick-service chips */}
        <div className="px-5 mt-1 mb-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
            {serviceChips.map((chip) => {
              const Icon = chip.icon;
              return (
                <button
                  key={chip.key}
                  onClick={() => handleServiceChip(chip)}
                  className="flex items-center gap-1.5 bg-card border border-border rounded-full px-3 py-1.5 text-xs font-medium text-foreground shadow-card hover:shadow-premium hover:border-primary/30 active:scale-95 transition-all whitespace-nowrap flex-shrink-0"
                >
                  <Icon className="w-3.5 h-3.5 text-primary" />
                  Nearest {chip.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Leaflet map */}
        <div className="mx-5 h-72 rounded-2xl overflow-hidden shadow-card relative z-0">
          <CampusMap
            buildings={upsaBuildings}
            selectedId={selected?.id ?? null}
            onSelect={(b) => {
              setSelected(b);
              setRouting(false);
            }}
            userPosition={userPos}
            userAccuracy={geoState === "granted" ? accuracy : null}
            routeFrom={userPos}
            routeTo={routeTo}
            onRouteSteps={(s, totals) => {
              setSteps(s);
              setRouteTotals(totals);
            }}
          />
        </div>

        {/* Turn-by-turn steps */}
        <AnimatePresence>
          {routing && selected && steps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mx-5 mt-3 bg-card rounded-2xl shadow-card overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                    <Route className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Turn-by-turn</p>
                    <p className="text-[11px] text-muted-foreground">
                      {routeTotals
                        ? `${Math.round(routeTotals.distance)}m · ~${Math.max(1, Math.round(routeTotals.duration / 60))} min walk`
                        : `${steps.length} steps`}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] text-muted-foreground truncate max-w-[120px]">to {selected.name}</span>
              </div>
              <ol className="divide-y divide-border max-h-64 overflow-y-auto">
                {steps.map((s, i) => {
                  const StepIcon =
                    s.type === "arrive" ? Flag :
                    s.type === "depart" ? ArrowUpRight :
                    s.modifier?.includes("right") ? CornerUpRight :
                    s.modifier?.includes("left") ? CornerUpLeft :
                    ArrowRight;
                  return (
                    <li key={i} className="flex items-start gap-3 px-4 py-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        s.type === "arrive" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
                      }`}>
                        <StepIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground leading-snug">{s.instruction}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground flex-shrink-0 mt-1">
                        {i + 1}/{steps.length}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected detail */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mx-5 mt-3 bg-card rounded-2xl p-4 shadow-card"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{selected.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {selected.category} · {selectedWalk?.meters}m away
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelected(null);
                    setRouting(false);
                  }}
                  className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center"
                  aria-label="Clear selection"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs text-foreground bg-muted rounded-lg px-2.5 py-1.5">
                  <Footprints className="w-3.5 h-3.5 text-primary" />
                  <span className="font-medium">{selectedWalk?.minutes} min walk</span>
                </div>
                <button
                  onClick={() => setRouting((r) => !r)}
                  className={`flex-1 text-xs font-semibold rounded-lg px-3 py-2 transition-all ${
                    routing
                      ? "bg-muted text-foreground"
                      : "gradient-primary text-primary-foreground shadow-premium"
                  }`}
                >
                  {routing ? "Hide route" : "Show route"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Context suggestion */}
        {nextClass && !selected && (
          <div className="mx-5 mt-3 bg-accent/10 rounded-2xl p-3 flex items-center gap-3">
            <Clock className="w-4 h-4 text-accent flex-shrink-0" />
            <p className="text-xs text-foreground">
              <span className="font-semibold">{nextClass.course}</span> starts soon — {nextClass.venue} is a short walk.
            </p>
          </div>
        )}

        {/* Sorted nearby list */}
        <div className="px-5 mt-5">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
            Nearest to you
          </p>
          <div className="space-y-2">
            {enriched.map((loc) => (
              <motion.button
                key={loc.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => {
                  setSelected(loc);
                  setRouting(false);
                }}
                className={`w-full text-left bg-card rounded-2xl p-4 shadow-card flex items-center gap-3 transition-all ${
                  selected?.id === loc.id ? "ring-2 ring-primary/40" : "hover:shadow-premium"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{loc.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {loc.category} · {loc.minutes} min · {loc.meters}m
                  </p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Navigation className="w-4 h-4 text-primary" />
                </div>
              </motion.button>
            ))}
            {enriched.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-6">No locations match.</p>
            )}
          </div>
        </div>
      </div>
      <BottomNav />
    </PageShell>
  );
}
