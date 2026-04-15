import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Bell, AlertTriangle, Calendar, MapPin, Clock, BookOpen, Megaphone, Check, CheckCheck } from "lucide-react";
import { Link } from "react-router-dom";
import PageShell from "@/components/PageShell";
import { notifications } from "@/data/mockData";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Megaphone, AlertTriangle, Calendar, MapPin, Clock, BookOpen, Bell,
};

const typeColors: Record<string, string> = {
  announcement: "bg-primary/10 text-primary",
  alert: "bg-destructive/10 text-destructive",
  event: "bg-accent/10 text-accent",
  class: "bg-warning/10 text-warning",
  system: "bg-muted text-muted-foreground",
};

export default function NotificationsPage() {
  const [items, setItems] = useState(notifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = items.filter(n => !n.read).length;
  const filtered = filter === "unread" ? items.filter(n => !n.read) : items;

  const markAllRead = () => {
    setItems(items.map(n => ({ ...n, read: true })));
  };

  const toggleRead = (id: number) => {
    setItems(items.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  return (
    <PageShell>
      <div className="max-w-lg mx-auto">
        <div className="px-5 pt-12 pb-4">
          <div className="flex items-center gap-3 mb-5">
            <Link to="/home" className="p-2 -ml-2 rounded-xl hover:bg-muted transition-colors">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">Notifications</h1>
              <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
            </div>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 p-1 bg-muted rounded-2xl mb-4">
            {(["all", "unread"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all capitalize ${
                  filter === f ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                }`}>
                {f === "all" ? "All" : `Unread (${unreadCount})`}
              </button>
            ))}
          </div>
        </div>

        <div className="px-5 space-y-2 mb-4">
          <AnimatePresence>
            {filtered.map((n, i) => {
              const Icon = iconMap[n.icon] || Bell;
              const colorClass = typeColors[n.type] || typeColors.system;
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => toggleRead(n.id)}
                  className={`bg-card rounded-2xl p-4 shadow-card flex items-start gap-3 cursor-pointer transition-all ${
                    !n.read ? "border-l-[3px] border-l-primary" : "opacity-70"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className={`text-sm font-semibold text-foreground leading-snug ${!n.read ? "" : ""}`}>{n.title}</p>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{n.body}</p>
                    <p className="text-[11px] text-muted-foreground/60 mt-1">{n.time}</p>
                  </div>
                  {n.read && <Check className="w-4 h-4 text-muted-foreground/40 flex-shrink-0 mt-1" />}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <Bell className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No unread notifications</p>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
