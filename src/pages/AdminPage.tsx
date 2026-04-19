import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Users, Megaphone, TrendingUp, Calendar, Activity, Shield, AlertTriangle, Bell, Building2, FileText, BarChart3, Send } from "lucide-react";
import { Link } from "react-router-dom";
import PageShell from "@/components/PageShell";
import { adminStats } from "@/data/mockData";

const statCards = [
  { icon: Users, label: "Active Users", value: adminStats.activeUsers.toLocaleString(), color: "bg-accent/10 text-accent", trend: "+12%" },
  { icon: Megaphone, label: "Announcements", value: adminStats.announcementsSent.toString(), color: "bg-primary/10 text-primary", trend: "+8" },
  { icon: TrendingUp, label: "Engagement", value: `${adminStats.engagementRate}%`, color: "bg-success/10 text-success", trend: "+5%" },
  { icon: Calendar, label: "Events", value: adminStats.upcomingEvents.toString(), color: "bg-warning/10 text-warning", trend: "3 new" },
];

const adminActions = [
  { icon: Megaphone, label: "Publish Notice", color: "bg-primary/10 text-primary" },
  { icon: AlertTriangle, label: "Emergency Alert", color: "bg-destructive/10 text-destructive" },
  { icon: Building2, label: "Departments", color: "bg-accent/10 text-accent" },
  { icon: FileText, label: "Forms & Deadlines", color: "bg-warning/10 text-warning" },
  { icon: Users, label: "Manage Users", color: "bg-success/10 text-success" },
  { icon: Shield, label: "Verify Channels", color: "bg-primary/10 text-primary" },
];

export default function AdminPage() {
  const maxEngagement = Math.max(...adminStats.weeklyEngagement);
  const maxGrowth = Math.max(...adminStats.growthTrend);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <PageShell padBottom={false}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="gradient-navy px-5 pt-12 pb-6 rounded-b-[2rem]">
          <div className="flex items-center gap-3 mb-5">
            <Link to="/home" className="p-2 -ml-2 rounded-xl hover:bg-primary-foreground/10 transition-colors">
              <ArrowLeft className="w-5 h-5 text-primary-foreground" />
            </Link>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-primary-foreground">Admin Dashboard</h1>
              <p className="text-xs text-primary-foreground/60">Campus Intelligence Overview</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-foreground/15 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {statCards.map(({ icon: Icon, label, value, color, trend }, i) => (
              <motion.div key={label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-3.5 border border-primary-foreground/5">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-primary-foreground/15`}>
                    <Icon className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="text-[10px] font-medium text-primary-foreground/60 bg-primary-foreground/10 px-1.5 py-0.5 rounded-full">{trend}</span>
                </div>
                <p className="text-xl font-bold text-primary-foreground">{value}</p>
                <p className="text-[11px] text-primary-foreground/50">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Command Center entry */}
        <section className="px-5 mt-5">
          <Link to="/command-center"
            className="block rounded-2xl p-4 shadow-premium bg-gradient-to-br from-primary to-accent text-primary-foreground active:scale-[0.99] transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">Open Command Center</p>
                <p className="text-[11px] text-primary-foreground/80">Live operations · alerts · bottlenecks</p>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/30 text-[10px] font-bold border border-success/40">
                LIVE
              </span>
            </div>
          </Link>
        </section>

        {/* Admin Actions */}
        <section className="px-5 mt-5">
          <h2 className="text-sm font-bold text-foreground mb-3">Admin Actions</h2>
          <div className="grid grid-cols-3 gap-2.5">
            {adminActions.map(({ icon: Icon, label, color }) => (
              <button key={label}
                className="flex flex-col items-center gap-1.5 bg-card rounded-2xl p-3 shadow-card active:scale-95 transition-transform">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium text-foreground text-center">{label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Publish Notice */}
        <section className="px-5 mt-5">
          <h2 className="text-sm font-bold text-foreground mb-3">Publish Campus Notice</h2>
          <div className="bg-card rounded-2xl p-4 shadow-card">
            <textarea
              placeholder="Write an official campus-wide notice…"
              className="w-full h-20 bg-muted rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[11px] text-muted-foreground">{adminStats.activeUsers.toLocaleString()} campus users</span>
              </div>
              <button className="px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-xs font-semibold flex items-center gap-1.5 shadow-premium active:scale-95 transition-transform">
                <Send className="w-3.5 h-3.5" />
                Publish
              </button>
            </div>
          </div>
        </section>

        {/* Weekly Engagement Chart */}
        <section className="px-5 mt-5">
          <div className="bg-card rounded-2xl p-5 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-foreground">Weekly Engagement</h2>
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex items-end gap-2 h-32">
              {adminStats.weeklyEngagement.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-muted-foreground font-medium">{v}%</span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(v / maxEngagement) * 100}%` }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                    className="w-full rounded-lg gradient-primary min-h-[4px]"
                  />
                  <span className="text-[10px] text-muted-foreground">{days[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Growth Chart */}
        <section className="px-5 mt-4">
          <div className="bg-card rounded-2xl p-5 shadow-card">
            <h2 className="text-sm font-bold text-foreground mb-4">User Growth</h2>
            <div className="flex items-end gap-2 h-28">
              {adminStats.growthTrend.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(v / maxGrowth) * 100}%` }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                    className="w-full rounded-lg bg-accent/80 min-h-[4px]"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="px-5 mt-4 mb-8">
          <div className="bg-card rounded-2xl p-5 shadow-card">
            <h2 className="text-sm font-bold text-foreground mb-3">Recent Activity</h2>
            <div className="space-y-3">
              {adminStats.recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Activity className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{a.action}</p>
                    <p className="text-xs text-muted-foreground">{a.detail} • {a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
