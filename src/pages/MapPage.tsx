import { useState } from "react";
import { Search, MapPin, Navigation, Clock } from "lucide-react";
import { motion } from "framer-motion";
import PageShell from "@/components/PageShell";
import BottomNav from "@/components/BottomNav";
import { campusLocations, todaySchedule } from "@/data/mockData";

const categories = ["All", "Academic", "Services", "Administrative", "Social"];

export default function MapPage() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [selected, setSelected] = useState<typeof campusLocations[0] | null>(null);

  const nextClass = todaySchedule.find((c) => c.status === "upcoming");
  const filtered = campusLocations.filter((l) => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = cat === "All" || l.category === cat;
    return matchSearch && matchCat;
  });

  return (
    <PageShell>
      <div className="max-w-lg mx-auto">
        <div className="px-5 pt-12 pb-4">
          <h1 className="text-xl font-bold text-foreground mb-4">Campus Map</h1>

          {/* Search */}
          <div className="flex items-center gap-3 bg-muted rounded-xl px-4 py-3 mb-3">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search locations…"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
            {categories.map((c) => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-colors ${
                  cat === c ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Map placeholder */}
        <div className="mx-5 h-52 bg-muted rounded-2xl relative overflow-hidden mb-4">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-success/5 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Interactive map</p>
              <p className="text-[10px] text-muted-foreground/60">UPSA Campus, Accra</p>
            </div>
          </div>
          {/* Simulated pins */}
          {filtered.slice(0, 5).map((loc, i) => (
            <button key={loc.id} onClick={() => setSelected(loc)}
              className={`absolute w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-125 ${
                selected?.id === loc.id ? "gradient-primary scale-125" : "bg-card border border-border"
              }`}
              style={{ top: `${20 + i * 30}px`, left: `${30 + i * 50}px` }}>
              <MapPin className={`w-3 h-3 ${selected?.id === loc.id ? "text-primary-foreground" : "text-primary"}`} />
            </button>
          ))}
        </div>

        {/* Context suggestion */}
        {nextClass && (
          <div className="mx-5 mb-4 bg-accent/10 rounded-2xl p-3 flex items-center gap-3">
            <Clock className="w-4 h-4 text-accent flex-shrink-0" />
            <p className="text-xs text-foreground">
              <span className="font-semibold">{nextClass.course}</span> starts soon. {nextClass.venue} is 4 min away.
            </p>
          </div>
        )}

        {/* Location list */}
        <div className="px-5 space-y-2 mb-4">
          {filtered.map((loc) => (
            <motion.div key={loc.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className={`bg-card rounded-2xl p-4 shadow-card flex items-center gap-3 transition-all ${
                selected?.id === loc.id ? "ring-2 ring-primary/30" : ""
              }`}
              onClick={() => setSelected(loc)}>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{loc.name}</p>
                <p className="text-xs text-muted-foreground">{loc.category} • {loc.distance}</p>
              </div>
              <button className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Navigation className="w-4 h-4 text-primary" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
      <BottomNav />
    </PageShell>
  );
}
