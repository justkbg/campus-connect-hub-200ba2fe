import { useEffect, useMemo, useRef, useState } from "react";
import { Search, MapPin, Navigation, Clock, Footprints, X, LocateFixed, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageShell from "@/components/PageShell";
import BottomNav from "@/components/BottomNav";
import CampusMap, { upsaBuildings, UPSA_CENTER, CampusBuilding } from "@/components/CampusMap";
import { todaySchedule } from "@/data/mockData";

const categories = ["All", "Academic", "Services", "Administrative", "Social"];

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
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [selected, setSelected] = useState<CampusBuilding | null>(null);
  const [routing, setRouting] = useState(false);
  const [userPos, setUserPos] = useState<[number, number]>(FALLBACK_POSITION);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [geoState, setGeoState] = useState<GeoState>("idle");
  const watchIdRef = useRef<number | null>(null);

  const nextClass = todaySchedule.find((c) => c.status === "upcoming");

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

          {/* Search */}
          <div className="flex items-center gap-3 bg-muted rounded-xl px-4 py-3 mb-3">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search lecture halls, services, offices…"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
            />
          </div>

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

        {/* Interactive Leaflet map */}
        <div className="mx-5 h-72 rounded-2xl overflow-hidden shadow-card relative z-0">
          <CampusMap
            buildings={upsaBuildings}
            selectedId={selected?.id ?? null}
            onSelect={(b) => {
              setSelected(b);
              setRouting(false);
            }}
            userPosition={USER_POSITION}
            routeFrom={USER_POSITION}
            routeTo={routeTo}
          />
        </div>

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
