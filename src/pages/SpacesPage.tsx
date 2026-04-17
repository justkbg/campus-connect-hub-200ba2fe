import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Search, MapPin, Navigation, Users, Volume2, VolumeX, Calendar, CheckCircle2, BookOpen, Cpu, Coffee, Filter } from "lucide-react";
import PageShell from "@/components/PageShell";
import BottomNav from "@/components/BottomNav";
import { campusSpaces, CampusSpace, SpaceType } from "@/data/mockData";
import { upsaBuildings } from "@/components/CampusMap";
import { toast } from "sonner";

const typeMeta: Record<SpaceType, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  classroom: { label: "Classrooms", icon: BookOpen },
  study: { label: "Study spots", icon: Coffee },
  lab: { label: "Labs", icon: Cpu },
};

const noiseIcon = { quiet: VolumeX, moderate: Volume2, lively: Volume2 } as const;

function occupancyTone(pct: number) {
  if (pct < 40) return { label: "Open", chip: "bg-success/15 text-success", bar: "bg-success" };
  if (pct < 80) return { label: "Filling up", chip: "bg-warning/15 text-warning", bar: "bg-warning" };
  return { label: "Almost full", chip: "bg-destructive/15 text-destructive", bar: "bg-destructive" };
}

const tabs: ("all" | SpaceType)[] = ["all", "classroom", "study", "lab"];

export default function SpacesPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("all");
  const [search, setSearch] = useState("");
  const [hideFull, setHideFull] = useState(true);
  const [reserved, setReserved] = useState<Set<string>>(new Set());

  const list = useMemo(() => {
    return campusSpaces
      .map((s) => ({ ...s, pct: Math.round((s.occupied / s.capacity) * 100) }))
      .filter((s) => (tab === "all" ? true : s.type === tab))
      .filter((s) => (hideFull ? s.pct < 95 : true))
      .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => a.pct - b.pct);
  }, [tab, search, hideFull]);

  const summary = useMemo(() => {
    const open = campusSpaces.filter((s) => s.occupied / s.capacity < 0.4).length;
    return { total: campusSpaces.length, open };
  }, []);

  const reserve = (s: CampusSpace) => {
    setReserved((r) => new Set(r).add(s.id));
    toast.success(`${s.name} reserved`, { description: "Hold for 15 min — head over now." });
  };

  return (
    <PageShell>
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="gradient-primary px-5 pt-12 pb-6 rounded-b-[2rem]">
          <div className="flex items-center gap-3 mb-4">
            <Link to="/services" className="p-2 -ml-2 rounded-xl hover:bg-primary-foreground/10">
              <ArrowLeft className="w-5 h-5 text-primary-foreground" />
            </Link>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-primary-foreground">Find a Space</h1>
              <p className="text-[11px] text-primary-foreground/70">Live occupancy across campus</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-primary-foreground/15 rounded-xl p-3">
              <p className="text-[10px] text-primary-foreground/70">Spaces tracked</p>
              <p className="text-lg font-bold text-primary-foreground">{summary.total}</p>
            </div>
            <div className="bg-primary-foreground/15 rounded-xl p-3">
              <p className="text-[10px] text-primary-foreground/70">Open now</p>
              <p className="text-lg font-bold text-primary-foreground">{summary.open}</p>
            </div>
            <div className="bg-primary-foreground/15 rounded-xl p-3">
              <p className="text-[10px] text-primary-foreground/70">Updated</p>
              <p className="text-lg font-bold text-primary-foreground">live</p>
            </div>
          </div>
        </div>

        {/* Search + filter */}
        <div className="px-5 mt-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 flex items-center gap-3 bg-muted rounded-xl px-4 py-3">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search rooms, labs…"
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              />
            </div>
            <button
              onClick={() => setHideFull((v) => !v)}
              aria-pressed={hideFull}
              className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                hideFull ? "gradient-primary text-primary-foreground shadow-premium" : "bg-muted text-foreground"
              }`}
              title="Hide full"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all ${
                  tab === t ? "gradient-primary text-primary-foreground shadow-premium" : "bg-muted text-muted-foreground"
                }`}
              >
                {t === "all" ? "All" : typeMeta[t].label}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="px-5 mt-4 space-y-2.5 mb-4">
          {list.map((s, i) => {
            const Icon = typeMeta[s.type].icon;
            const tone = occupancyTone(s.pct);
            const NIcon = noiseIcon[s.noise];
            const isReserved = reserved.has(s.id);
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-card rounded-2xl p-4 shadow-card"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-foreground truncate">{s.name}</p>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${tone.chip}`}>
                        {tone.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-2">
                      <Users className="w-3 h-3" /> {s.occupied}/{s.capacity}
                      <span>·</span>
                      <NIcon className="w-3 h-3" /> {s.noise}
                      <span>·</span>
                      <MapPin className="w-3 h-3" /> {s.walkingMin} min
                    </p>

                    {/* Occupancy bar */}
                    <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${s.pct}%` }}
                        transition={{ duration: 0.5 }}
                        className={`h-full ${tone.bar} rounded-full`}
                      />
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {s.amenities.map((a) => (
                        <span key={a} className="text-[10px] bg-muted text-muted-foreground rounded-md px-1.5 py-0.5">{a}</span>
                      ))}
                    </div>

                    {s.nextBookedAt && (
                      <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Next booked: {s.nextBookedAt}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 mt-3">
                      <Link
                        to={`/map?to=${s.buildingId}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-muted text-foreground rounded-xl py-2 text-xs font-semibold"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        Navigate
                      </Link>
                      {s.reservable ? (
                        <button
                          onClick={() => !isReserved && reserve(s)}
                          disabled={isReserved}
                          className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-all ${
                            isReserved
                              ? "bg-success/15 text-success"
                              : "gradient-primary text-primary-foreground shadow-premium active:scale-[0.98]"
                          }`}
                        >
                          {isReserved ? <><CheckCircle2 className="w-3.5 h-3.5" /> Reserved</> : <>Reserve</>}
                        </button>
                      ) : (
                        <span className="flex-1 inline-flex items-center justify-center text-[11px] text-muted-foreground bg-muted/50 rounded-xl py-2">
                          Drop-in only
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
          {list.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-8">No matching spaces.</p>
          )}
        </div>
      </div>
      <BottomNav />
    </PageShell>
  );
}
