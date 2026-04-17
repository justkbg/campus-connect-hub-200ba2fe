import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Ticket, Clock, Users, Navigation, CheckCircle2, X, Bell, FileText, CreditCard, Monitor, Volume2 } from "lucide-react";
import PageShell from "@/components/PageShell";
import BottomNav from "@/components/BottomNav";
import { queueOffices, QueueOffice } from "@/data/mockData";
import { upsaBuildings } from "@/components/CampusMap";
import { toast } from "sonner";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText, CreditCard, Monitor, Users,
};

type ActiveTicket = {
  officeId: string;
  number: string;
  position: number;
  etaMin: number;
  takenAt: number;
};

const STORAGE_KEY = "cis.activeQueueTicket";

function loadTicket(): ActiveTicket | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function QueuePage() {
  const [activeTicket, setActiveTicket] = useState<ActiveTicket | null>(loadTicket);
  const [selected, setSelected] = useState<QueueOffice | null>(null);

  // Persist active ticket
  useEffect(() => {
    if (activeTicket) localStorage.setItem(STORAGE_KEY, JSON.stringify(activeTicket));
    else localStorage.removeItem(STORAGE_KEY);
  }, [activeTicket]);

  // Live tick: simulate the queue moving forward every 30s
  useEffect(() => {
    if (!activeTicket) return;
    const id = setInterval(() => {
      setActiveTicket((t) => {
        if (!t) return t;
        const newPos = Math.max(0, t.position - 1);
        const office = queueOffices.find((o) => o.id === t.officeId);
        const perPerson = office ? Math.max(2, Math.round(office.averageWaitMin / Math.max(1, office.inQueue))) : 3;
        const newEta = Math.max(0, newPos * perPerson);
        if (newPos === 0 && t.position > 0) {
          toast.success(`You're next! Ticket ${t.number}`, { description: "Please head to the office." });
        }
        return { ...t, position: newPos, etaMin: newEta };
      });
    }, 30000);
    return () => clearInterval(id);
  }, [activeTicket?.number]);

  const takeTicket = (office: QueueOffice) => {
    if (activeTicket) {
      toast.error("You already have an active ticket", { description: "Cancel it to take a new one." });
      return;
    }
    const num = `${office.ticketPrefix}-${String(office.nextNumber).padStart(3, "0")}`;
    const perPerson = Math.max(2, Math.round(office.averageWaitMin / Math.max(1, office.inQueue)));
    const ticket: ActiveTicket = {
      officeId: office.id,
      number: num,
      position: office.inQueue,
      etaMin: office.averageWaitMin,
      takenAt: Date.now(),
    };
    setActiveTicket(ticket);
    setSelected(null);
    toast.success(`Ticket ${num} reserved`, { description: `${office.name} · ~${ticket.etaMin} min wait` });
  };

  const cancelTicket = () => {
    setActiveTicket(null);
    toast("Ticket cancelled");
  };

  const activeOffice = useMemo(
    () => (activeTicket ? queueOffices.find((o) => o.id === activeTicket.officeId) ?? null : null),
    [activeTicket]
  );

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
              <h1 className="text-xl font-bold text-primary-foreground">Smart Queues</h1>
              <p className="text-[11px] text-primary-foreground/70">Skip the line — reserve your spot</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-foreground/15 flex items-center justify-center">
              <Ticket className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>

          {/* Active ticket banner */}
          <AnimatePresence>
            {activeTicket && activeOffice && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-primary-foreground/15 backdrop-blur-xl rounded-2xl p-4 border border-primary-foreground/15"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-[11px] font-medium text-primary-foreground/70 uppercase tracking-wide">Your ticket</p>
                    <p className="text-3xl font-bold text-primary-foreground tracking-tight mt-0.5">{activeTicket.number}</p>
                    <p className="text-xs text-primary-foreground/70 mt-0.5">{activeOffice.name}</p>
                  </div>
                  <button
                    onClick={cancelTicket}
                    className="w-8 h-8 rounded-lg bg-primary-foreground/15 flex items-center justify-center hover:bg-primary-foreground/25"
                    aria-label="Cancel ticket"
                  >
                    <X className="w-4 h-4 text-primary-foreground" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-primary-foreground/10 rounded-xl p-2.5">
                    <p className="text-[10px] text-primary-foreground/60">Position</p>
                    <p className="text-sm font-bold text-primary-foreground">{activeTicket.position === 0 ? "Next!" : `#${activeTicket.position}`}</p>
                  </div>
                  <div className="bg-primary-foreground/10 rounded-xl p-2.5">
                    <p className="text-[10px] text-primary-foreground/60">ETA</p>
                    <p className="text-sm font-bold text-primary-foreground">~{activeTicket.etaMin} min</p>
                  </div>
                  <div className="bg-primary-foreground/10 rounded-xl p-2.5">
                    <p className="text-[10px] text-primary-foreground/60">Now serving</p>
                    <p className="text-sm font-bold text-primary-foreground">{activeOffice.nowServing}</p>
                  </div>
                </div>
                <Link
                  to={`/map?to=${activeOffice.buildingId}`}
                  className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-primary-foreground text-primary rounded-xl py-2.5 text-xs font-semibold shadow-premium active:scale-[0.98]"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Navigate to office
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Office list */}
        <section className="px-5 mt-5 mb-4">
          <h2 className="text-sm font-bold text-foreground mb-3">Available offices</h2>
          <div className="space-y-3">
            {queueOffices.map((office, i) => {
              const Icon = iconMap[office.icon] ?? Users;
              const isActive = activeTicket?.officeId === office.id;
              return (
                <motion.div
                  key={office.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`bg-card rounded-2xl p-4 shadow-card ${isActive ? "ring-2 ring-primary/40" : ""}`}
                >
                  <button
                    onClick={() => setSelected(selected?.id === office.id ? null : office)}
                    className="w-full text-left flex items-start gap-3"
                  >
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{office.name}</p>
                      <p className="text-[11px] text-muted-foreground">{office.category} · {office.hours}</p>
                      <div className="flex items-center gap-3 mt-2 text-[11px]">
                        <span className="inline-flex items-center gap-1 text-foreground">
                          <Volume2 className="w-3 h-3 text-success" />
                          <span className="font-semibold">{office.nowServing}</span>
                        </span>
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <Users className="w-3 h-3" />
                          {office.inQueue} waiting
                        </span>
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          ~{office.averageWaitMin} min
                        </span>
                      </div>
                    </div>
                  </button>

                  <AnimatePresence>
                    {selected?.id === office.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-border space-y-3">
                          {/* Counters */}
                          <div>
                            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Counters</p>
                            <div className="space-y-1.5">
                              {office.counters.map((c) => (
                                <div key={c.id} className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2">
                                  <div>
                                    <p className="text-xs font-semibold text-foreground">{c.label}</p>
                                    <p className="text-[10px] text-muted-foreground">Serving {c.serving}</p>
                                  </div>
                                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                    c.status === "active" ? "bg-success/15 text-success" :
                                    c.status === "paused" ? "bg-warning/15 text-warning" :
                                    "bg-muted text-muted-foreground"
                                  }`}>
                                    {c.status}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Recent calls */}
                          <div>
                            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Recently called</p>
                            <div className="flex flex-wrap gap-1.5">
                              {office.recentCalls.map((r) => (
                                <span key={r.number} className="text-[11px] bg-muted rounded-lg px-2 py-1">
                                  <span className="font-semibold text-foreground">{r.number}</span>
                                  <span className="text-muted-foreground"> · {r.counter} · {r.time}</span>
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-2 pt-1">
                            <Link
                              to={`/map?to=${office.buildingId}`}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 bg-muted text-foreground rounded-xl py-2.5 text-xs font-semibold"
                            >
                              <Navigation className="w-3.5 h-3.5" />
                              Locate
                            </Link>
                            <button
                              onClick={() => takeTicket(office)}
                              disabled={isActive}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 gradient-primary text-primary-foreground rounded-xl py-2.5 text-xs font-semibold shadow-premium active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
                            >
                              {isActive ? <><CheckCircle2 className="w-3.5 h-3.5" /> Active</> : <><Ticket className="w-3.5 h-3.5" /> Take ticket</>}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-5 p-3 bg-accent/10 rounded-2xl flex items-start gap-2">
            <Bell className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-foreground">
              You'll get a live notification when your number is 3 ahead. Tickets auto-expire if missed twice.
            </p>
          </div>
        </section>
      </div>
      <BottomNav />
    </PageShell>
  );
}
