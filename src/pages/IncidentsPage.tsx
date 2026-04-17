import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Camera, MapPin, Send, Wrench, Shield, Wifi, Sparkles, Zap, Droplet, AlertCircle, Plus, CheckCircle2, Clock, Loader2, X, Navigation } from "lucide-react";
import PageShell from "@/components/PageShell";
import BottomNav from "@/components/BottomNav";
import { incidents as seedIncidents, incidentCategories, Incident, IncidentStatus, currentUser } from "@/data/mockData";
import { upsaBuildings } from "@/components/CampusMap";
import { toast } from "sonner";

const catIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  Wrench, Shield, Wifi, Sparkles, Zap, Droplet, AlertCircle,
};

const statusMeta: Record<IncidentStatus, { label: string; tone: string; icon: React.ComponentType<{ className?: string }> }> = {
  submitted: { label: "Submitted", tone: "bg-accent/15 text-accent", icon: Clock },
  "in-progress": { label: "In progress", tone: "bg-warning/15 text-warning", icon: Loader2 },
  resolved: { label: "Resolved", tone: "bg-success/15 text-success", icon: CheckCircle2 },
};

const tabs: ("All" | IncidentStatus)[] = ["All", "submitted", "in-progress", "resolved"];

export default function IncidentsPage() {
  const [items, setItems] = useState<Incident[]>(seedIncidents);
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Incident | null>(null);

  const filtered = useMemo(
    () => (tab === "All" ? items : items.filter((i) => i.status === tab)),
    [items, tab]
  );

  const addIncident = (data: { category: string; title: string; description: string; locationId: string; photo?: string }) => {
    const building = upsaBuildings.find((b) => String(b.id) === data.locationId);
    const newItem: Incident = {
      id: `INC-${Math.floor(2900 + Math.random() * 100)}`,
      category: data.category,
      title: data.title,
      description: data.description,
      location: building?.name ?? "Campus",
      buildingId: building?.id,
      status: "submitted",
      reportedBy: currentUser.firstName,
      reportedAt: "Just now",
      photo: data.photo,
      updates: [{ status: "submitted", note: "Report received", time: "Just now" }],
    };
    setItems((prev) => [newItem, ...prev]);
    setShowForm(false);
    toast.success("Report submitted", { description: `${newItem.id} · we'll keep you posted` });
  };

  return (
    <PageShell>
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="gradient-primary px-5 pt-12 pb-6 rounded-b-[2rem]">
          <div className="flex items-center gap-3 mb-3">
            <Link to="/services" className="p-2 -ml-2 rounded-xl hover:bg-primary-foreground/10">
              <ArrowLeft className="w-5 h-5 text-primary-foreground" />
            </Link>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-primary-foreground">Report an Issue</h1>
              <p className="text-[11px] text-primary-foreground/70">Help keep campus working for everyone</p>
            </div>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="w-full inline-flex items-center justify-center gap-2 bg-primary-foreground text-primary rounded-xl py-3 text-sm font-semibold shadow-premium active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            New report
          </button>
        </div>

        {/* Filter tabs */}
        <div className="px-5 mt-5">
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
            {tabs.map((t) => {
              const label = t === "All" ? "All" : statusMeta[t].label;
              const count = t === "All" ? items.length : items.filter((i) => i.status === t).length;
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all ${
                    tab === t ? "gradient-primary text-primary-foreground shadow-premium" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {label} <span className="opacity-60">· {count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* List */}
        <div className="px-5 mt-4 space-y-2.5 mb-4">
          {filtered.map((inc, i) => {
            const Cat = incidentCategories.find((c) => c.label === inc.category);
            const Icon = (Cat && catIcon[Cat.icon]) || AlertCircle;
            const StatusIcon = statusMeta[inc.status].icon;
            return (
              <motion.button
                key={inc.id}
                onClick={() => setSelected(inc)}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="w-full text-left bg-card rounded-2xl p-4 shadow-card hover:shadow-premium transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-bold text-muted-foreground">{inc.id}</span>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusMeta[inc.status].tone}`}>
                        <StatusIcon className={`w-2.5 h-2.5 ${inc.status === "in-progress" ? "animate-spin" : ""}`} />
                        {statusMeta[inc.status].label}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-foreground leading-snug">{inc.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {inc.location} · {inc.reportedAt}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
          {filtered.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-8">No reports in this view.</p>
          )}
        </div>
      </div>

      {/* New report sheet */}
      <AnimatePresence>
        {showForm && <ReportForm onClose={() => setShowForm(false)} onSubmit={addIncident} />}
      </AnimatePresence>

      {/* Detail sheet */}
      <AnimatePresence>
        {selected && <DetailSheet incident={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>

      <BottomNav />
    </PageShell>
  );
}

function ReportForm({ onClose, onSubmit }: { onClose: () => void; onSubmit: (d: { category: string; title: string; description: string; locationId: string; photo?: string }) => void }) {
  const [category, setCategory] = useState(incidentCategories[0].label);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [locationId, setLocationId] = useState<string>(String(upsaBuildings[0].id));
  const [photo, setPhoto] = useState<string | undefined>();
  const [autoTagged, setAutoTagged] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const detectLocation = () => {
    if (!("geolocation" in navigator)) {
      toast.error("Geolocation not supported");
      return;
    }
    toast("Detecting location…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // Pick nearest known building
        const nearest = upsaBuildings
          .map((b) => {
            const dx = b.position[0] - pos.coords.latitude;
            const dy = b.position[1] - pos.coords.longitude;
            return { b, d: dx * dx + dy * dy };
          })
          .sort((a, z) => a.d - z.d)[0];
        if (nearest) {
          setLocationId(String(nearest.b.id));
          setAutoTagged(true);
          toast.success(`Location auto-tagged: ${nearest.b.name}`);
        }
      },
      () => toast.error("Couldn't access location"),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(typeof reader.result === "string" ? reader.result : undefined);
    reader.readAsDataURL(file);
  };

  const submit = () => {
    if (!title.trim()) {
      toast.error("Add a short title");
      return;
    }
    onSubmit({ category, title: title.trim(), description: desc.trim(), locationId, photo });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-foreground/40 z-40"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-card px-5 pt-4 pb-3 border-b border-border flex items-center justify-between">
          <div>
            <p className="text-base font-bold text-foreground">New report</p>
            <p className="text-[11px] text-muted-foreground">Photo, location, details</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-lg hover:bg-muted flex items-center justify-center">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Category */}
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Category</p>
            <div className="grid grid-cols-4 gap-2">
              {incidentCategories.map((c) => {
                const Icon = catIcon[c.icon] ?? AlertCircle;
                const active = category === c.label;
                return (
                  <button
                    key={c.key}
                    onClick={() => setCategory(c.label)}
                    className={`flex flex-col items-center gap-1 rounded-xl p-2.5 transition-all ${
                      active ? "gradient-primary text-primary-foreground shadow-premium" : "bg-muted text-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px] font-medium">{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Photo */}
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Photo</p>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={onPhoto} className="hidden" />
            {photo ? (
              <div className="relative rounded-xl overflow-hidden">
                <img src={photo} alt="Report" className="w-full h-44 object-cover" />
                <button
                  onClick={() => setPhoto(undefined)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-foreground/60 backdrop-blur flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-background" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
              >
                <Camera className="w-6 h-6" />
                <span className="text-xs font-medium">Tap to take/upload photo</span>
              </button>
            )}
          </div>

          {/* Location */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Location</p>
              <button onClick={detectLocation} className="text-[11px] text-primary font-semibold inline-flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Auto-detect
              </button>
            </div>
            <select
              value={locationId}
              onChange={(e) => { setLocationId(e.target.value); setAutoTagged(false); }}
              className="w-full bg-muted rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {upsaBuildings.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
            {autoTagged && (
              <p className="text-[10px] text-success mt-1 inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Location auto-tagged from GPS
              </p>
            )}
          </div>

          {/* Title + desc */}
          <div className="space-y-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 80))}
              placeholder="Short title (e.g. broken AC in LT3)"
              className="w-full bg-muted rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value.slice(0, 400))}
              placeholder="What's wrong? Add context if helpful…"
              className="w-full h-24 bg-muted rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          </div>

          <button
            onClick={submit}
            className="w-full inline-flex items-center justify-center gap-2 gradient-primary text-primary-foreground rounded-xl py-3 text-sm font-semibold shadow-premium active:scale-[0.98]"
          >
            <Send className="w-4 h-4" />
            Submit report
          </button>
        </div>
      </motion.div>
    </>
  );
}

function DetailSheet({ incident, onClose }: { incident: Incident; onClose: () => void }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-foreground/40 z-40"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl max-h-[85vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-card px-5 pt-4 pb-3 border-b border-border flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground">{incident.id}</p>
            <p className="text-base font-bold text-foreground">{incident.title}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-lg hover:bg-muted flex items-center justify-center">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {incident.photo && (
            <img src={incident.photo} alt="" className="w-full h-48 object-cover rounded-xl" />
          )}

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-muted rounded-xl p-3">
              <p className="text-[10px] text-muted-foreground">Category</p>
              <p className="text-xs font-semibold text-foreground">{incident.category}</p>
            </div>
            <div className="bg-muted rounded-xl p-3">
              <p className="text-[10px] text-muted-foreground">Reported by</p>
              <p className="text-xs font-semibold text-foreground">{incident.reportedBy}</p>
            </div>
          </div>

          {incident.description && (
            <p className="text-sm text-foreground leading-relaxed">{incident.description}</p>
          )}

          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Status timeline</p>
            <div className="space-y-3">
              {incident.updates.map((u, i) => {
                const SI = statusMeta[u.status].icon;
                return (
                  <div key={i} className="flex gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${statusMeta[u.status].tone}`}>
                      <SI className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-foreground">{statusMeta[u.status].label}</p>
                      <p className="text-[11px] text-muted-foreground">{u.note} · {u.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {incident.buildingId && (
            <Link
              to={`/map?to=${incident.buildingId}`}
              className="w-full inline-flex items-center justify-center gap-2 bg-muted text-foreground rounded-xl py-2.5 text-xs font-semibold"
            >
              <Navigation className="w-3.5 h-3.5" />
              Locate on map
            </Link>
          )}
        </div>
      </motion.div>
    </>
  );
}
