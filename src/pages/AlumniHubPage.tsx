import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Search, GraduationCap, HeartHandshake, Gift, Users,
  CalendarDays, MapPin, Briefcase, MessageCircle, ChevronRight, Sparkles,
} from "lucide-react";
import PageShell from "@/components/PageShell";
import BottomNav from "@/components/BottomNav";
import { alumni, alumniIndustries, reunionEvents, givingCauses, type AlumniIndustry } from "@/data/alumniData";

const tabs = [
  { id: "network", label: "Network", icon: Users },
  { id: "reunions", label: "Reunions", icon: CalendarDays },
  { id: "mentor", label: "Mentorship", icon: HeartHandshake },
  { id: "give", label: "Give back", icon: Gift },
] as const;
type TabId = typeof tabs[number]["id"];

const yearBuckets = ["All", "2020s", "2010s", "2000s"] as const;

function bucketYear(y: number) {
  if (y >= 2020) return "2020s";
  if (y >= 2010) return "2010s";
  return "2000s";
}

export default function AlumniHubPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabId>("network");
  const [q, setQ] = useState("");
  const [industry, setIndustry] = useState<AlumniIndustry | "All">("All");
  const [bucket, setBucket] = useState<typeof yearBuckets[number]>("All");

  const filtered = useMemo(() => {
    const ql = q.toLowerCase().trim();
    return alumni.filter((a) => {
      if (industry !== "All" && a.industry !== industry) return false;
      if (bucket !== "All" && bucketYear(a.gradYear) !== bucket) return false;
      if (!ql) return true;
      return [a.name, a.role, a.company, a.programme, a.city, String(a.gradYear)]
        .some((s) => s.toLowerCase().includes(ql));
    });
  }, [q, industry, bucket]);

  const mentors = filtered.filter((a) => a.mentor);

  return (
    <PageShell>
      <div className="max-w-lg mx-auto pb-4">
        {/* Hero */}
        <div className="gradient-hero px-5 pt-12 pb-6 rounded-b-[2rem] relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-primary-foreground/10 blur-3xl" />
          <div className="relative z-10 flex items-center justify-between mb-5">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-primary-foreground/15 flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 text-primary-foreground" />
            </button>
            <span className="text-[11px] font-semibold text-primary-foreground/80 tracking-wider uppercase">
              Alumni Hub
            </span>
            <div className="w-10" />
          </div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
            <h1 className="text-2xl font-bold text-primary-foreground leading-tight">
              Stay connected, give back.
            </h1>
            <p className="text-sm text-primary-foreground/70 mt-1 max-w-xs">
              Reunions, mentorship and a network of UPSA graduates across industries.
            </p>
            <div className="flex gap-2 mt-4">
              <div className="flex-1 bg-primary-foreground/15 backdrop-blur-xl border border-primary-foreground/20 rounded-2xl px-3 py-2.5 text-center">
                <p className="text-lg font-bold text-primary-foreground">{alumni.length.toLocaleString()}+</p>
                <p className="text-[10px] text-primary-foreground/70">Alumni</p>
              </div>
              <div className="flex-1 bg-primary-foreground/15 backdrop-blur-xl border border-primary-foreground/20 rounded-2xl px-3 py-2.5 text-center">
                <p className="text-lg font-bold text-primary-foreground">{mentors.length}</p>
                <p className="text-[10px] text-primary-foreground/70">Mentors</p>
              </div>
              <div className="flex-1 bg-primary-foreground/15 backdrop-blur-xl border border-primary-foreground/20 rounded-2xl px-3 py-2.5 text-center">
                <p className="text-lg font-bold text-primary-foreground">{reunionEvents.length}</p>
                <p className="text-[10px] text-primary-foreground/70">Events</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="px-5 -mt-4">
          <div className="bg-card rounded-2xl shadow-card p-1 grid grid-cols-4 gap-1">
            {tabs.map(({ id, label, icon: Icon }) => {
              const active = tab === id;
              return (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`flex flex-col items-center gap-1 py-2 rounded-xl transition-all ${
                    active ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-semibold">{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {tab === "network" && (
          <section className="px-5 mt-5">
            <div className="flex items-center gap-3 bg-muted rounded-xl px-4 py-3">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name, company, year…"
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
            </div>
            <div className="flex gap-1.5 mt-3 overflow-x-auto no-scrollbar -mx-5 px-5">
              {yearBuckets.map((b) => (
                <button
                  key={b}
                  onClick={() => setBucket(b)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${
                    bucket === b
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border"
                  }`}
                >
                  {b}
                </button>
              ))}
              <span className="w-px self-stretch bg-border mx-1" />
              <button
                onClick={() => setIndustry("All")}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold border ${
                  industry === "All" ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border"
                }`}
              >
                All industries
              </button>
              {alumniIndustries.map((i) => (
                <button
                  key={i}
                  onClick={() => setIndustry(i)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold border ${
                    industry === i ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border"
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>

            <p className="text-[11px] text-muted-foreground mt-3">{filtered.length} match{filtered.length === 1 ? "" : "es"}</p>

            <div className="space-y-2 mt-2">
              {filtered.map((a) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-2xl p-4 shadow-card flex items-start gap-3"
                >
                  <div className="w-11 h-11 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary-foreground">{a.initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-foreground">{a.name}</p>
                      {a.mentor && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-success/10 text-success text-[9px] font-bold">
                          <Sparkles className="w-2.5 h-2.5" /> Mentor
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                      {a.role} • {a.company}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1"><GraduationCap className="w-2.5 h-2.5" />{a.programme} '{String(a.gradYear).slice(2)}</span>
                      <span className="inline-flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />{a.city}</span>
                      <span className="inline-flex items-center gap-1"><Briefcase className="w-2.5 h-2.5" />{a.industry}</span>
                    </p>
                  </div>
                  <button className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-3.5 h-3.5 text-primary" />
                  </button>
                </motion.div>
              ))}
              {filtered.length === 0 && (
                <p className="text-center text-xs text-muted-foreground py-8">No alumni match those filters.</p>
              )}
            </div>
          </section>
        )}

        {tab === "reunions" && (
          <section className="px-5 mt-5 space-y-2">
            {reunionEvents.map((e) => (
              <div key={e.id} className="bg-card rounded-2xl p-4 shadow-card">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-[9px] text-primary-foreground/70 font-semibold">{e.date.split(" ")[0]}</span>
                    <span className="text-base font-bold text-primary-foreground leading-none">{e.date.split(" ")[1]}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{e.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{e.time} • {e.venue}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{e.cohort} • {e.going} going</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 bg-primary text-primary-foreground rounded-xl py-2 text-[11px] font-semibold">
                    RSVP
                  </button>
                  <Link to="/map" className="flex-1 bg-muted text-foreground rounded-xl py-2 text-[11px] font-semibold text-center">
                    Directions
                  </Link>
                </div>
              </div>
            ))}
          </section>
        )}

        {tab === "mentor" && (
          <section className="px-5 mt-5">
            <div className="bg-card rounded-2xl p-4 shadow-card mb-3">
              <p className="text-sm font-semibold text-foreground">Find a mentor</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Matched on your programme, industry, and goals.</p>
              <button className="mt-3 w-full gradient-primary text-primary-foreground rounded-xl py-2.5 text-xs font-semibold">
                Get matched in 60 seconds
              </button>
            </div>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2 px-1">
              Open mentors ({mentors.length})
            </p>
            <div className="space-y-2">
              {mentors.map((m) => (
                <div key={m.id} className="bg-card rounded-2xl p-4 shadow-card">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary-foreground">{m.initials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{m.name}</p>
                      <p className="text-[11px] text-muted-foreground">{m.role} • {m.company}</p>
                      {m.bio && <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{m.bio}</p>}
                    </div>
                  </div>
                  <button className="mt-3 w-full bg-primary/10 text-primary rounded-xl py-2 text-[11px] font-semibold">
                    Request 1:1
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === "give" && (
          <section className="px-5 mt-5 space-y-3">
            {givingCauses.map((c) => {
              const pct = Math.round((c.raised / c.goal) * 100);
              return (
                <div key={c.id} className="bg-card rounded-2xl p-4 shadow-card">
                  <p className="text-sm font-semibold text-foreground">{c.title}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-base font-bold text-primary">{c.currency} {c.raised.toLocaleString()}</span>
                    <span className="text-[11px] text-muted-foreground">of {c.currency} {c.goal.toLocaleString()}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full gradient-primary" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[11px] text-muted-foreground">{c.donors} donors • {pct}%</span>
                    <button className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold inline-flex items-center gap-1">
                      <Gift className="w-3 h-3" /> Donate
                    </button>
                  </div>
                </div>
              );
            })}
            <Link
              to="/opportunities"
              className="block bg-card rounded-2xl p-4 shadow-card border border-primary/10"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">Post an opportunity</p>
                  <p className="text-[11px] text-muted-foreground">Share jobs, internships, and scholarships with students.</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Link>
          </section>
        )}
      </div>
      <BottomNav />
    </PageShell>
  );
}
