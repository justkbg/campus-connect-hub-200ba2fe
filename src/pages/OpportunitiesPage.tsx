import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Search, Bookmark, BookmarkCheck, ExternalLink, Briefcase,
  GraduationCap, Trophy, Building2, Clock, MapPin, Sparkles, Filter,
} from "lucide-react";
import PageShell from "@/components/PageShell";
import BottomNav from "@/components/BottomNav";
import { opportunities, currentUser, type OpportunityType } from "@/data/mockData";

const typeMeta: Record<OpportunityType, { label: string; icon: any; tint: string }> = {
  internship: { label: "Internships", icon: Briefcase, tint: "text-primary bg-primary/10" },
  scholarship: { label: "Scholarships", icon: GraduationCap, tint: "text-success bg-success/10" },
  job: { label: "Jobs", icon: Building2, tint: "text-accent bg-accent/10" },
  competition: { label: "Competitions", icon: Trophy, tint: "text-warning bg-warning/10" },
};

const SAVED_KEY = "cis.savedOpportunities";

function daysLeft(deadlineISO: string) {
  const ms = new Date(deadlineISO).getTime() - Date.now();
  return Math.ceil(ms / 86400000);
}

function deadlineTone(days: number) {
  if (days <= 3) return "bg-destructive/10 text-destructive border-destructive/20";
  if (days <= 10) return "bg-warning/10 text-warning border-warning/20";
  return "bg-muted text-muted-foreground border-border";
}

export default function OpportunitiesPage() {
  const [filter, setFilter] = useState<"all" | OpportunityType | "saved">("all");
  const [q, setQ] = useState("");
  const [saved, setSaved] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try { return new Set(JSON.parse(localStorage.getItem(SAVED_KEY) || "[]")); }
    catch { return new Set(); }
  });

  useEffect(() => {
    localStorage.setItem(SAVED_KEY, JSON.stringify(Array.from(saved)));
  }, [saved]);

  const toggleSave = (id: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filtered = useMemo(() => {
    return opportunities
      .filter((o) => {
        if (filter === "saved") return saved.has(o.id);
        if (filter !== "all" && o.type !== filter) return false;
        if (!q.trim()) return true;
        const blob = `${o.title} ${o.organization} ${o.tags.join(" ")}`.toLowerCase();
        return blob.includes(q.toLowerCase());
      })
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  }, [filter, q, saved]);

  const featured = opportunities.filter((o) => o.featured).slice(0, 3);

  // Personalised callout based on user role/dept
  const recommended = opportunities.filter(
    (o) => o.eligibility?.toLowerCase().includes("it") || o.tags.some((t) => /react|node|sql/i.test(t)),
  )[0];

  const tabs: Array<{ key: typeof filter; label: string; count?: number }> = [
    { key: "all", label: "All", count: opportunities.length },
    { key: "internship", label: "Internships" },
    { key: "scholarship", label: "Scholarships" },
    { key: "job", label: "Jobs" },
    { key: "competition", label: "Competitions" },
    { key: "saved", label: "Saved", count: saved.size },
  ];

  return (
    <PageShell>
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="px-5 pt-12 pb-3">
          <div className="flex items-center gap-3 mb-4">
            <Link to="/home" className="p-2 -ml-2 rounded-xl hover:bg-muted transition-colors">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">Opportunities</h1>
              <p className="text-xs text-muted-foreground">Internships · scholarships · jobs · competitions</p>
            </div>
          </div>

          {/* Personalised banner */}
          {recommended && (
            <Link to="#"
              className="block mb-3 rounded-2xl p-3.5 bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-premium"
            >
              <div className="flex items-center gap-2 text-[11px] font-semibold opacity-80 mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Recommended for {currentUser.firstName}
              </div>
              <p className="text-sm font-bold leading-snug">{recommended.title}</p>
              <p className="text-[11px] opacity-80 mt-0.5">
                {recommended.organization} · matches your {currentUser.department} profile
              </p>
            </Link>
          )}

          {/* Search */}
          <div className="flex items-center gap-3 bg-muted rounded-xl px-4 py-2.5 mb-3">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Search organisations, roles, tags…"
              className="flex-1 bg-transparent text-sm focus:outline-none text-foreground placeholder:text-muted-foreground/60"
            />
            {q && <button onClick={() => setQ("")} className="text-xs text-primary font-medium">Clear</button>}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
            {tabs.map((t) => {
              const active = filter === t.key;
              return (
                <button key={t.key} onClick={() => setFilter(t.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all ${
                    active
                      ? "gradient-primary text-primary-foreground shadow-premium"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {t.label}{typeof t.count === "number" ? ` · ${t.count}` : ""}
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured carousel */}
        {filter === "all" && !q && (
          <section className="mb-2">
            <div className="px-5 flex items-center justify-between mb-2">
              <h2 className="text-xs font-bold text-foreground uppercase tracking-wide">Featured</h2>
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Filter className="w-3 h-3" /> sorted by deadline
              </span>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-2">
              {featured.map((o) => {
                const days = daysLeft(o.deadline);
                const Meta = typeMeta[o.type];
                return (
                  <div key={o.id}
                    className={`min-w-[260px] rounded-2xl p-4 shadow-premium bg-gradient-to-br ${o.logoColor} text-primary-foreground flex-shrink-0`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-semibold opacity-80 mb-2">
                      <span className="uppercase tracking-wider">{Meta.label.slice(0, -1)}</span>
                      <span>{days > 0 ? `${days}d left` : "closed"}</span>
                    </div>
                    <p className="text-sm font-bold leading-snug">{o.title}</p>
                    <p className="text-[11px] opacity-80 mt-0.5">{o.organization}</p>
                    <p className="text-[11px] opacity-90 mt-2 line-clamp-2">{o.description}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* List */}
        <div className="px-5 space-y-2.5 mb-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((o, i) => {
              const Meta = typeMeta[o.type];
              const days = daysLeft(o.deadline);
              const isSaved = saved.has(o.id);
              return (
                <motion.div
                  key={o.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ delay: i * 0.025 }}
                  className="bg-card rounded-2xl p-4 shadow-card"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${Meta.tint}`}>
                      <Meta.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-foreground leading-snug">{o.title}</p>
                        <button onClick={() => toggleSave(o.id)}
                          className="flex-shrink-0 p-1 -mt-1 -mr-1 rounded-lg hover:bg-muted transition-colors"
                          aria-label={isSaved ? "Unsave" : "Save"}
                        >
                          {isSaved
                            ? <BookmarkCheck className="w-4 h-4 text-primary" />
                            : <Bookmark className="w-4 h-4 text-muted-foreground" />}
                        </button>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{o.organization}</p>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px] text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{o.location}</span>
                        {o.stipend && <span className="font-semibold text-foreground">{o.stipend}</span>}
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {o.tags.slice(0, 3).map((t) => (
                          <span key={t} className="px-2 py-0.5 rounded-full bg-muted text-[10px] font-medium text-muted-foreground">
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/60">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${deadlineTone(days)}`}>
                          <Clock className="w-3 h-3" />
                          {days > 0 ? `${days} day${days === 1 ? "" : "s"} left` : "Closed"}
                        </span>
                        <a
                          href={o.applyUrl} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl gradient-primary text-primary-foreground text-[11px] font-semibold shadow-premium active:scale-95 transition-transform"
                        >
                          Apply
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                {filter === "saved" ? "No saved opportunities yet" : "No opportunities match your search"}
              </p>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </PageShell>
  );
}
