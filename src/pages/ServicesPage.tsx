import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Navigation, Printer, Building2, Monitor, BookOpen, Users, Bath, Wifi, CreditCard, PenTool, Ticket, AlertOctagon, Building, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import PageShell from "@/components/PageShell";
import BottomNav from "@/components/BottomNav";
import StatusBadge from "@/components/StatusBadge";
import { services } from "@/data/mockData";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Printer, Building2, Monitor, BookOpen, Users, Bath, Wifi, CreditCard, PenTool,
};

const featured = [
  { to: "/queues", icon: Ticket, title: "Smart Queues", subtitle: "Skip the line — remote tickets", color: "from-primary to-accent" },
  { to: "/spaces", icon: Building, title: "Find a Space", subtitle: "Live classroom & study availability", color: "from-accent to-primary" },
  { to: "/incidents", icon: AlertOctagon, title: "Report an Issue", subtitle: "Photo + location + status tracking", color: "from-destructive to-warning" },
];

const cats = ["All", "Offices", "Printing", "Academic", "WiFi Zones", "Services", "Washrooms"];

export default function ServicesPage() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");

  const filtered = services.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = cat === "All" || s.category === cat;
    return matchSearch && matchCat;
  });

  return (
    <PageShell>
      <div className="max-w-lg mx-auto">
        <div className="px-5 pt-12 pb-4">
          <h1 className="text-xl font-bold text-foreground mb-4">Services</h1>

          <div className="flex items-center gap-3 bg-muted rounded-xl px-4 py-3 mb-3">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services…"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none" />
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
            {cats.map((c) => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-colors ${
                  cat === c ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Featured smart services */}
        <div className="px-5 mb-4 space-y-2">
          {featured.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.to}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  to={f.to}
                  className={`block rounded-2xl p-4 shadow-premium bg-gradient-to-br ${f.color} text-primary-foreground active:scale-[0.99] transition-transform`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold">{f.title}</p>
                      <p className="text-[11px] text-primary-foreground/80">{f.subtitle}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-primary-foreground/80" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="px-5 space-y-2 mb-4">
          {filtered.map((s, i) => {
            const Icon = iconMap[s.icon] || Building2;
            return (
              <motion.div key={s.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-foreground">{s.name}</p>
                    <StatusBadge status={s.status} />
                  </div>
                  <p className="text-xs text-muted-foreground">{s.category} • {s.distance} walk</p>
                </div>
                <button className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Navigation className="w-4 h-4 text-primary" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
      <BottomNav />
    </PageShell>
  );
}
