import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, MapPin, Car, Building2, Megaphone, LifeBuoy, Search,
  Phone, Calendar, QrCode, Compass, ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { announcements, events, services } from "@/data/mockData";
import { upsaBuildings } from "@/components/CampusMap";
import UnifiedSearch from "@/components/UnifiedSearch";
import LiveCampusDashboard from "@/components/LiveCampusDashboard";
import { useRole } from "@/contexts/RoleContext";

const visitorTiles = [
  { icon: MapPin, label: "Campus Map", desc: "Find any building", path: "/map", tone: "bg-primary/10 text-primary" },
  { icon: Car, label: "Parking", desc: "Visitor lots & gates", path: "/map?layer=parking", tone: "bg-warning/10 text-warning" },
  { icon: Building2, label: "Office Finder", desc: "Registrar, Bursary, ICT", path: "/map", tone: "bg-accent/10 text-accent" },
  { icon: Calendar, label: "Public Events", desc: "Open to visitors", path: "/visit#events", tone: "bg-success/10 text-success" },
  { icon: Megaphone, label: "Public Notices", desc: "Campus updates", path: "/visit#notices", tone: "bg-primary/10 text-primary" },
  { icon: LifeBuoy, label: "Help Desk", desc: "Talk to a steward", path: "/visit#help", tone: "bg-destructive/10 text-destructive" },
];

const parkingLots = [
  { id: "P1", name: "Visitor Lot · Main Gate", spots: "42 / 80 free", tone: "text-success" },
  { id: "P2", name: "Lot B · Library", spots: "11 / 60 free", tone: "text-warning" },
  { id: "P3", name: "Lot C · Sports Complex", spots: "38 / 50 free", tone: "text-success" },
];

const helpContacts = [
  { name: "Main Reception", role: "First point of contact", phone: "+233 30 274 0000" },
  { name: "Security Desk", role: "24/7 campus safety", phone: "+233 30 274 0911" },
  { name: "Visitor Steward", role: "Walk-in tours", phone: "+233 30 274 0123" },
];

export default function VisitPage() {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const { setRole } = useRole();

  // Public-facing offices only (Academic Affairs, ICT, Library, Banking)
  const publicOffices = services.filter((s) =>
    ["Offices", "Academic", "Services"].includes(s.category)
  ).slice(0, 6);

  const featuredBuildings = upsaBuildings.slice(0, 4);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero */}
      <div className="gradient-hero px-5 pt-12 pb-10 rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-primary-foreground/10 blur-3xl" />
        <div className="relative z-10 flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full bg-primary-foreground/15 backdrop-blur flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 text-primary-foreground" />
          </button>
          <span className="text-[11px] font-semibold text-primary-foreground/80 tracking-wider uppercase">
            Visitor Mode
          </span>
          <button
            onClick={() => { setRole("student"); navigate("/login"); }}
            className="text-[11px] font-semibold text-primary-foreground/90 underline-offset-2 underline"
          >
            Sign in
          </button>
        </div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
          <h1 className="text-2xl font-bold text-primary-foreground leading-tight">
            Welcome to UPSA
          </h1>
          <p className="text-sm text-primary-foreground/70 mt-1 max-w-xs">
            Find your way around campus, locate offices, and stay informed — no account needed.
          </p>

          <button
            onClick={() => setSearchOpen(true)}
            className="mt-5 w-full flex items-center gap-3 bg-primary-foreground/15 backdrop-blur-xl border border-primary-foreground/20 rounded-2xl px-4 py-3 text-left"
          >
            <Search className="w-4 h-4 text-primary-foreground/80" />
            <span className="text-sm text-primary-foreground/70 flex-1">
              Search buildings, events, offices…
            </span>
            <kbd className="text-[10px] font-semibold text-primary-foreground/60 border border-primary-foreground/20 rounded px-1.5 py-0.5">
              ⌘K
            </kbd>
          </button>
        </motion.div>
      </div>

      <div className="max-w-lg mx-auto px-5 -mt-6">
        {/* Quick tiles */}
        <div className="grid grid-cols-2 gap-2.5">
          {visitorTiles.map(({ icon: Icon, label, desc, path, tone }) => (
            <Link
              key={label}
              to={path}
              className="bg-card rounded-2xl p-4 shadow-card flex flex-col gap-2 active:scale-[0.98] transition-transform"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${tone}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="text-[11px] text-muted-foreground">{desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Smart arrival prompt */}
        <Link
          to="/arrival"
          className="mt-4 block bg-card rounded-2xl p-4 shadow-card border border-primary/10"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Compass className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Are you on campus?</p>
              <p className="text-[11px] text-muted-foreground">
                Enable Smart Arrival for live directions and gate check-in.
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </Link>

        {/* Live campus dashboard */}
        <section id="live" className="mt-6">
          <LiveCampusDashboard variant="full" title="Live campus dashboard" />
        </section>

        {/* Parking */}
        <section className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-foreground">Parking availability</h2>
            <span className="text-[10px] text-muted-foreground">Updated 2 min ago</span>
          </div>
          <div className="space-y-2">
            {parkingLots.map((p) => (
              <div key={p.id} className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Car className="w-4 h-4 text-warning" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{p.name}</p>
                  <p className={`text-xs font-medium ${p.tone}`}>{p.spots}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </section>

        {/* Featured buildings */}
        <section className="mt-6">
          <h2 className="text-sm font-bold text-foreground mb-3">Featured locations</h2>
          <div className="grid grid-cols-2 gap-2.5">
            {featuredBuildings.map((b) => (
              <Link
                key={b.id}
                to={`/map?to=${b.id}`}
                className="bg-card rounded-2xl p-3 shadow-card"
              >
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center mb-2">
                  <MapPin className="w-4 h-4 text-accent" />
                </div>
                <p className="text-xs font-semibold text-foreground leading-snug">{b.name}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{b.category}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Public offices */}
        <section id="offices" className="mt-6">
          <h2 className="text-sm font-bold text-foreground mb-3">Public offices</h2>
          <div className="space-y-2">
            {publicOffices.map((o) => (
              <div key={o.id} className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{o.name}</p>
                  <p className="text-[11px] text-muted-foreground">{o.distance} • {o.status}</p>
                </div>
                <Link to="/map" className="text-[11px] font-semibold text-primary">Direct me</Link>
              </div>
            ))}
          </div>
        </section>

        {/* Public events */}
        <section id="events" className="mt-6">
          <h2 className="text-sm font-bold text-foreground mb-3">Open events</h2>
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5">
            {events.map((e) => (
              <div key={e.id} className="min-w-[200px] bg-card rounded-2xl p-4 shadow-card flex-shrink-0">
                <div className="text-xs font-semibold text-primary mb-2">{e.date}</div>
                <p className="text-sm font-semibold text-foreground mb-1">{e.title}</p>
                <p className="text-xs text-muted-foreground">{e.time} • {e.location}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Notices */}
        <section id="notices" className="mt-6">
          <h2 className="text-sm font-bold text-foreground mb-3">Public notices</h2>
          <div className="space-y-2">
            {announcements.filter((a) => a.type !== "urgent" || a.id === 5).slice(0, 4).map((a) => (
              <div key={a.id} className="bg-card rounded-2xl p-4 shadow-card">
                <p className="text-sm font-semibold text-foreground">{a.title}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{a.department} • {a.time}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Help desk */}
        <section id="help" className="mt-6 mb-8">
          <h2 className="text-sm font-bold text-foreground mb-3">Help desk</h2>
          <div className="space-y-2">
            {helpContacts.map((c) => (
              <a
                key={c.name}
                href={`tel:${c.phone.replace(/\s/g, "")}`}
                className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-success/10 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-success" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground">{c.role}</p>
                </div>
                <span className="text-xs text-primary font-semibold">{c.phone}</span>
              </a>
            ))}
            <Link
              to="/arrival"
              className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                <QrCode className="w-4 h-4 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Scan a campus QR</p>
                <p className="text-[11px] text-muted-foreground">Gates, offices, parking meters</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          </div>
        </section>
      </div>

      <UnifiedSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}
