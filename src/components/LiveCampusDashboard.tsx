import { motion } from "framer-motion";
import { Activity, AlertTriangle, Users, Clock, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { campusDensity, topServicesInDemand, liveAlerts, type DensityLevel } from "@/data/alumniData";

const levelTone: Record<DensityLevel, { bg: string; bar: string; text: string; label: string }> = {
  low:    { bg: "bg-success/10",    bar: "bg-success",    text: "text-success",    label: "Low" },
  medium: { bg: "bg-accent/10",     bar: "bg-accent",     text: "text-accent",     label: "Medium" },
  high:   { bg: "bg-warning/10",    bar: "bg-warning",    text: "text-warning",    label: "High" },
  peak:   { bg: "bg-destructive/10",bar: "bg-destructive",text: "text-destructive",label: "Peak" },
};

type Props = {
  variant?: "compact" | "full";
  title?: string;
};

export default function LiveCampusDashboard({ variant = "compact", title = "Live campus" }: Props) {
  const sorted = [...campusDensity].sort((a, b) => b.pct - a.pct);
  const items = variant === "compact" ? sorted.slice(0, 4) : sorted;
  const totalPeople = campusDensity.reduce((s, d) => s + d.people, 0);

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-4 shadow-card"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Activity className="w-3.5 h-3.5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground leading-tight">{title}</p>
            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              Updated just now • {totalPeople.toLocaleString()} on campus
            </p>
          </div>
        </div>
        {variant === "compact" && (
          <Link to="/visit#live" className="text-[11px] font-semibold text-primary">See all</Link>
        )}
      </div>

      {/* Density heatmap */}
      <div className="space-y-1.5">
        {items.map((d) => {
          const tone = levelTone[d.level];
          return (
            <div key={d.id} className="flex items-center gap-2.5">
              <span className="text-[11px] font-medium text-foreground w-28 truncate">{d.name}</span>
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${d.pct}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={`h-full ${tone.bar}`}
                />
              </div>
              <span className={`text-[10px] font-semibold ${tone.text} w-12 text-right`}>{tone.label}</span>
            </div>
          );
        })}
      </div>

      {/* Active alerts */}
      {liveAlerts.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border space-y-1.5">
          {liveAlerts.slice(0, variant === "compact" ? 1 : 3).map((a) => (
            <div key={a.id} className="flex items-start gap-2">
              <AlertTriangle className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${
                a.severity === "critical" ? "text-destructive" : "text-warning"
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-foreground leading-snug">{a.title}</p>
                <p className="text-[10px] text-muted-foreground">{a.source}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Top services in demand (full only) */}
      {variant === "full" && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Top services in demand
          </p>
          <div className="space-y-1.5">
            {topServicesInDemand.map((s) => (
              <Link
                key={s.id}
                to="/queues"
                className="flex items-center gap-2 p-2 rounded-xl bg-muted/40 hover:bg-muted active:scale-[0.99] transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="flex-1 text-xs font-semibold text-foreground">{s.name}</span>
                <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock className="w-3 h-3" />{s.eta}
                </span>
                <span className="text-[10px] font-bold text-primary">{s.waiting} waiting</span>
                <ChevronRight className="w-3 h-3 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </motion.section>
  );
}
