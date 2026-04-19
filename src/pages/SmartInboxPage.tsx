import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Bell, Timer, Ticket, AlertTriangle, MapPin, Calendar, Wifi,
  BookOpen, Briefcase, Printer, CheckCheck, ChevronRight, Sparkles,
} from "lucide-react";
import PageShell from "@/components/PageShell";
import BottomNav from "@/components/BottomNav";
import { smartNotifications, type NotifPriority, type NotifCategory, type SmartNotif } from "@/data/mockData";

const iconMap: Record<string, any> = {
  Timer, Ticket, AlertTriangle, MapPin, Calendar, Wifi, BookOpen, Briefcase, Printer, Bell,
};

const priorityMeta: Record<NotifPriority, { label: string; tint: string; ring: string; order: number }> = {
  critical: { label: "Critical", tint: "bg-destructive/10 text-destructive", ring: "border-l-destructive", order: 0 },
  high:     { label: "High",     tint: "bg-warning/10 text-warning",        ring: "border-l-warning",     order: 1 },
  normal:   { label: "Normal",   tint: "bg-accent/10 text-accent",          ring: "border-l-accent",      order: 2 },
  low:      { label: "Low",      tint: "bg-muted text-muted-foreground",    ring: "border-l-muted",       order: 3 },
};

const categoryFilters: Array<{ key: "all" | NotifCategory; label: string }> = [
  { key: "all", label: "All" },
  { key: "class", label: "Classes" },
  { key: "deadline", label: "Deadlines" },
  { key: "queue", label: "Queues" },
  { key: "location", label: "Nearby" },
  { key: "opportunity", label: "Opps" },
  { key: "announcement", label: "Notices" },
];

export default function SmartInboxPage() {
  const [items, setItems] = useState<SmartNotif[]>(smartNotifications);
  const [cat, setCat] = useState<"all" | NotifCategory>("all");
  const [unreadOnly, setUnreadOnly] = useState(false);

  const unreadCount = items.filter((n) => !n.read).length;

  const filtered = useMemo(() => {
    return items
      .filter((n) => (cat === "all" ? true : n.category === cat))
      .filter((n) => (unreadOnly ? !n.read : true));
  }, [items, cat, unreadOnly]);

  const grouped = useMemo(() => {
    const buckets: Record<NotifPriority, SmartNotif[]> = { critical: [], high: [], normal: [], low: [] };
    for (const n of filtered) buckets[n.priority].push(n);
    return (Object.entries(buckets) as Array<[NotifPriority, SmartNotif[]]>)
      .filter(([, list]) => list.length > 0)
      .sort((a, b) => priorityMeta[a[0]].order - priorityMeta[b[0]].order);
  }, [filtered]);

  const markAllRead = () => setItems(items.map((n) => ({ ...n, read: true })));
  const toggleRead = (id: string) =>
    setItems(items.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));

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
              <h1 className="text-xl font-bold text-foreground">Smart Inbox</h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-primary" />
                Personalised by time, location & schedule
              </p>
            </div>
            {unreadCount > 0 && (
              <button onClick={markAllRead}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                <CheckCheck className="w-3.5 h-3.5" />
                Mark read
              </button>
            )}
          </div>

          {/* Summary chips */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="rounded-xl bg-destructive/10 p-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-destructive/80">Critical</p>
              <p className="text-lg font-bold text-destructive">
                {items.filter((n) => n.priority === "critical" && !n.read).length}
              </p>
            </div>
            <div className="rounded-xl bg-warning/10 p-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-warning/80">High</p>
              <p className="text-lg font-bold text-warning">
                {items.filter((n) => n.priority === "high" && !n.read).length}
              </p>
            </div>
            <div className="rounded-xl bg-accent/10 p-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-accent/80">Other</p>
              <p className="text-lg font-bold text-accent">
                {items.filter((n) => (n.priority === "normal" || n.priority === "low") && !n.read).length}
              </p>
            </div>
          </div>

          {/* Category chips */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
            {categoryFilters.map((c) => {
              const active = cat === c.key;
              return (
                <button key={c.key} onClick={() => setCat(c.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all ${
                    active ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                  {c.label}
                </button>
              );
            })}
            <button onClick={() => setUnreadOnly((v) => !v)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all ${
                unreadOnly ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
              Unread only
            </button>
          </div>
        </div>

        {/* Grouped list */}
        <div className="px-5 mb-4 space-y-5">
          <AnimatePresence>
            {grouped.map(([priority, list]) => (
              <motion.section key={priority}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${priorityMeta[priority].tint}`}>
                    {priorityMeta[priority].label}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{list.length} item{list.length === 1 ? "" : "s"}</span>
                </div>
                <div className="space-y-2">
                  {list.map((n) => {
                    const Icon = iconMap[n.icon] || Bell;
                    return (
                      <motion.div key={n.id} layout
                        className={`bg-card rounded-2xl p-4 shadow-card border-l-[3px] ${priorityMeta[n.priority].ring} ${
                          n.read ? "opacity-70" : ""
                        }`}
                        onClick={() => toggleRead(n.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${priorityMeta[n.priority].tint}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-foreground leading-snug">{n.title}</p>
                              {!n.read && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-[11px] text-muted-foreground/70">{n.time}</span>
                              {n.actionLabel && n.actionPath && (
                                <Link to={n.actionPath}
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary"
                                >
                                  {n.actionLabel}
                                  <ChevronRight className="w-3 h-3" />
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.section>
            ))}
          </AnimatePresence>

          {grouped.length === 0 && (
            <div className="text-center py-12">
              <Bell className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">You're all caught up</p>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </PageShell>
  );
}
