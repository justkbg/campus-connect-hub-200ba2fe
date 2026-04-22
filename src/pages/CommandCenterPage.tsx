import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Activity, Users, AlertTriangle, TrendingUp, Zap, ChevronRight,
  Radio, ShieldAlert, BarChart3, ArrowUpRight, Gauge,
} from "lucide-react";
import PageShell from "@/components/PageShell";
import { commandCenter, queueOffices, incidents, campusSpaces } from "@/data/mockData";

const severityTint: Record<string, string> = {
  critical: "bg-destructive/10 text-destructive border-destructive/20",
  high:     "bg-warning/10 text-warning border-warning/20",
  medium:   "bg-accent/10 text-accent border-accent/20",
  info:     "bg-muted text-muted-foreground border-border",
};

function Sparkline({ values, accent = "hsl(var(--primary))" }: { values: number[]; accent?: string }) {
  const w = 200, h = 56, pad = 4;
  const min = Math.min(...values), max = Math.max(...values);
  const span = max - min || 1;
  const step = (w - pad * 2) / (values.length - 1);
  const pts = values.map((v, i) => [pad + i * step, h - pad - ((v - min) / span) * (h - pad * 2)]);
  const d = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");
  const area = `${d} L${pts[pts.length - 1][0]},${h} L${pts[0][0]},${h} Z`;
  const last = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-14 overflow-visible">
      <defs>
        <linearGradient id="sg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
        <filter id="sg-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <motion.path
        d={area}
        fill="url(#sg)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      <motion.path
        d={d}
        stroke={accent}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#sg-glow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
      />
      <motion.circle
        cx={last[0]} cy={last[1]} r="3" fill={accent}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 1, 1], scale: [0, 1.4, 1] }}
        transition={{ duration: 1.6, times: [0, 0.85, 1] }}
      />
      <motion.circle
        cx={last[0]} cy={last[1]} r="3" fill="none" stroke={accent} strokeWidth="1.5"
        animate={{ r: [3, 9], opacity: [0.6, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
      />
    </svg>
  );
}

export default function CommandCenterPage() {
  // Live tick: wiggle live users number every 5s for "real-time" feel
  const [live, setLive] = useState(commandCenter.liveActiveUsers);
  useEffect(() => {
    const id = setInterval(() => {
      setLive((v) => Math.max(900, v + Math.round((Math.random() - 0.5) * 24)));
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const totalSpaces = campusSpaces.length;
  const fullSpaces = campusSpaces.filter((s) => s.occupied / s.capacity >= 0.85).length;
  const openIncidents = incidents.filter((i) => i.status !== "resolved").length;
  const longestQueue = queueOffices.reduce((m, o) => (o.inQueue > m.inQueue ? o : m), queueOffices[0]);

  const maxHourly = Math.max(...commandCenter.hourlyActivity.map((h) => h.value));

  return (
    <PageShell padBottom={false}>
      <div className="max-w-2xl mx-auto pb-10">
        {/* Header */}
        <div className="gradient-navy px-5 pt-12 pb-6 rounded-b-[2rem]">
          <div className="flex items-center gap-3 mb-5">
            <Link to="/admin" className="p-2 -ml-2 rounded-xl hover:bg-primary-foreground/10 transition-colors">
              <ArrowLeft className="w-5 h-5 text-primary-foreground" />
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-primary-foreground">Command Center</h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/20 text-success text-[10px] font-bold border border-success/30">
                  <Radio className="w-2.5 h-2.5 animate-pulse" />
                  LIVE
                </span>
              </div>
              <p className="text-xs text-primary-foreground/60">Campus operations · real-time</p>
            </div>
          </div>

          {/* Hero metric */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-4 border border-primary-foreground/10 relative overflow-hidden"
          >
            {/* scanning shimmer */}
            <motion.div
              aria-hidden
              className="absolute inset-y-0 -left-1/3 w-1/3 pointer-events-none"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)" }}
              animate={{ x: ["0%", "420%"] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.4 }}
            />
            <div className="flex items-center justify-between relative">
              <div>
                <p className="text-[11px] font-medium text-primary-foreground/60 uppercase tracking-wider">Active users right now</p>
                <motion.p
                  key={live}
                  initial={{ opacity: 0.6, y: -2 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-3xl font-bold text-primary-foreground mt-1 tabular-nums"
                >{live.toLocaleString()}</motion.p>
                <p className="text-[11px] text-primary-foreground/60 mt-1 inline-flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3 text-success" /> +12% vs last week
                </p>
              </div>
              <div className="w-32 -mr-2 opacity-90">
                <Sparkline values={commandCenter.activeUsersTrend} accent="hsl(var(--primary-foreground))" />
              </div>
            </div>
          </motion.div>

          {/* KPI row */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            {[
              { label: "Classes in session", value: `${commandCenter.classesInSession}/${commandCenter.classesTotalToday}`, icon: Activity },
              { label: "Open incidents", value: openIncidents.toString(), icon: ShieldAlert },
              { label: "Spaces near full", value: `${fullSpaces}/${totalSpaces}`, icon: Gauge },
            ].map((k) => (
              <div key={k.label} className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-2.5 border border-primary-foreground/10">
                <k.icon className="w-3.5 h-3.5 text-primary-foreground/60 mb-1" />
                <p className="text-base font-bold text-primary-foreground tabular-nums">{k.value}</p>
                <p className="text-[10px] text-primary-foreground/60 leading-tight">{k.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Critical alerts */}
        <section className="px-5 mt-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-foreground">Critical Alerts</h2>
            <span className="text-[11px] text-muted-foreground">{commandCenter.criticalAlerts.length} active</span>
          </div>
          <div className="space-y-2">
            {commandCenter.criticalAlerts.map((a) => (
              <div key={a.id} className={`rounded-2xl p-3.5 border ${severityTint[a.severity]} flex items-start gap-3`}>
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{a.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{a.source} · {a.time}</p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider self-center">
                  {a.severity}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Hourly activity chart */}
        <section className="px-5 mt-5">
          <div className="bg-card rounded-2xl p-5 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-foreground">Today's activity</h2>
                <p className="text-[11px] text-muted-foreground">Active sessions per hour</p>
              </div>
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex items-end gap-1.5 h-32">
              {commandCenter.hourlyActivity.map((h, i) => {
                const peak = h.value === maxHourly;
                return (
                  <div key={h.hour} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(h.value / maxHourly) * 100}%` }}
                      transition={{ delay: i * 0.03, duration: 0.4 }}
                      className={`w-full rounded-md min-h-[3px] ${peak ? "gradient-primary" : "bg-primary/30"}`}
                      title={`${h.value}`}
                    />
                    <span className="text-[9px] text-muted-foreground">{h.hour}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-[11px] text-muted-foreground">
              <TrendingUp className="w-3 h-3 text-success" />
              Peak at {commandCenter.hourlyActivity.find((h) => h.value === maxHourly)?.hour}:00 — {maxHourly.toLocaleString()} active
            </div>
          </div>
        </section>

        {/* Bottlenecks + Engagement */}
        <section className="px-5 mt-4 grid sm:grid-cols-2 gap-4">
          <div className="bg-card rounded-2xl p-5 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-foreground">Bottlenecks</h2>
              <Zap className="w-4 h-4 text-warning" />
            </div>
            <div className="space-y-2.5">
              {commandCenter.bottlenecks.map((b) => (
                <Link key={b.id} to={b.path}
                  className="flex items-center gap-3 group">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    b.severity === "critical" ? "bg-destructive animate-pulse" :
                    b.severity === "high" ? "bg-warning" : "bg-accent"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {b.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{b.detail}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-border/60 text-[11px] text-muted-foreground">
              Longest queue: <span className="font-semibold text-foreground">{longestQueue.name}</span> · {longestQueue.inQueue} waiting
            </div>
          </div>

          <div className="bg-card rounded-2xl p-5 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-foreground">Feature engagement</h2>
              <Users className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="space-y-2.5">
              {commandCenter.engagementByFeature.map((f, i) => (
                <div key={f.feature}>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-medium text-foreground">{f.feature}</span>
                    <span className="tabular-nums text-muted-foreground">{f.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${f.pct}%` }}
                      transition={{ delay: i * 0.05, duration: 0.5 }}
                      className="h-full gradient-primary rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Top issues */}
        <section className="px-5 mt-4">
          <div className="bg-card rounded-2xl p-5 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-bold text-foreground">Most-reported issues</h2>
                <p className="text-[11px] text-muted-foreground">Last 7 days</p>
              </div>
              <ShieldAlert className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="space-y-2.5">
              {commandCenter.topReportedIssues.map((r) => (
                <div key={r.label} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-foreground w-24 flex-shrink-0">{r.label}</span>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: `${r.pct * 3}%` }} />
                  </div>
                  <span className="text-xs tabular-nums text-muted-foreground w-10 text-right">{r.count}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
