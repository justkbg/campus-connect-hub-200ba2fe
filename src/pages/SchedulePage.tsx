import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, MapPin, User as UserIcon } from "lucide-react";
import PageShell from "@/components/PageShell";
import BottomNav from "@/components/BottomNav";
import StatusBadge from "@/components/StatusBadge";
import { todaySchedule, weekSchedule } from "@/data/mockData";

export default function SchedulePage() {
  const [view, setView] = useState<"today" | "week">("today");
  const remaining = todaySchedule.filter((c) => c.status !== "completed").length;

  return (
    <PageShell>
      <div className="max-w-lg mx-auto">
        <div className="px-5 pt-12 pb-4">
          <h1 className="text-xl font-bold text-foreground mb-1">Schedule</h1>
          <p className="text-xs text-muted-foreground mb-4">{remaining} classes remaining today</p>

          {/* View toggle */}
          <div className="flex gap-2 p-1 bg-muted rounded-2xl mb-5">
            {(["today", "week"] as const).map((v) => (
              <button key={v} onClick={() => setView(v)}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all capitalize ${
                  view === v ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                }`}>
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="px-5 space-y-3 mb-4">
          {view === "today" ? (
            todaySchedule.map((c, i) => (
              <motion.div key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`bg-card rounded-2xl p-4 shadow-card border-l-[3px] ${
                  c.status === "ongoing" ? "border-l-success" : c.status === "upcoming" ? "border-l-accent" : "border-l-muted"
                }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-primary">{c.course}</span>
                  <StatusBadge status={c.status} />
                </div>
                <p className="text-sm font-semibold text-foreground">{c.title}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{c.time}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{c.venue}</span>
                  <span className="flex items-center gap-1"><UserIcon className="w-3 h-3" />{c.lecturer.split(" ").slice(-1)}</span>
                </div>
              </motion.div>
            ))
          ) : (
            weekSchedule.map((day) => (
              <div key={day.day}>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{day.day}</h3>
                <div className="space-y-2 mb-4">
                  {day.classes.map((c) => (
                    <div key={c.id} className="bg-card rounded-2xl p-3 shadow-card">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-primary">{c.course}</span>
                        <span className="text-[11px] text-muted-foreground">{c.time.split("–")[0]}</span>
                      </div>
                      <p className="text-sm font-medium text-foreground">{c.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{c.venue} • {c.lecturer}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <BottomNav />
    </PageShell>
  );
}
